from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError
from ..schemas.mototaxi_schema import MototaxiSchema, MototaxiQuerySchema
from ..services.mototaxi_service import MototaxiService
mototaxis_bp = Blueprint('mototaxis',__name__)
mschema = MototaxiSchema()
qschema = MototaxiQuerySchema()
@mototaxis_bp.route('', methods=['GET'])
@jwt_required()
def list_mototaxis():
    try:
        params = qschema.load(request.args)
    except ValidationError as e:
        return jsonify({'error':'Parámetros inválidos','details':e.messages}), 400
    motos, total, page, tp = MototaxiService.get_all_paginated(params)
    return jsonify({'data':[m.to_dict(include_conductor=True) for m in motos],'meta':{'total':total,'page':page,'per_page':params['per_page'],'total_pages':tp}}), 200
@mototaxis_bp.route('', methods=['POST'])
@jwt_required()
def create_mototaxi():
    try:
        data = mschema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({'error':'Datos inválidos','details':e.messages}), 400
    if MototaxiService.get_by_placa(data['placa']):
        return jsonify({'error':'Placa ya registrada'}), 409
    m = MototaxiService.create(data)
    return jsonify({'data':m.to_dict(include_conductor=True),'message':'Mototaxi creada'}), 201
@mototaxis_bp.route('/<int:mid>', methods=['GET'])
@jwt_required()
def get_mototaxi(mid):
    m = MototaxiService.get_by_id(mid)
    if not m: return jsonify({'error':'No encontrada'}), 404
    return jsonify({'data':m.to_dict(include_conductor=True)}), 200
@mototaxis_bp.route('/<int:mid>', methods=['PUT'])
@jwt_required()
def update_mototaxi(mid):
    m = MototaxiService.get_by_id(mid)
    if not m: return jsonify({'error':'No encontrada'}), 404
    try:
        data = mschema.load(request.get_json() or {}, partial=True)
    except ValidationError as e:
        return jsonify({'error':'Datos inválidos','details':e.messages}), 400
    if data.get('placa'):
        ex = MototaxiService.get_by_placa(data['placa'])
        if ex and ex.id != mid: return jsonify({'error':'Placa ya registrada'}), 409
    m = MototaxiService.update(m, data)
    return jsonify({'data':m.to_dict(include_conductor=True),'message':'Actualizada'}), 200
@mototaxis_bp.route('/<int:mid>', methods=['DELETE'])
@jwt_required()
def delete_mototaxi(mid):
    m = MototaxiService.get_by_id(mid)
    if not m: return jsonify({'error':'No encontrada'}), 404
    MototaxiService.delete(m)
    return jsonify({'message':'Eliminada'}), 200
