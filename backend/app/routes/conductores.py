from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError
from ..schemas.conductor_schema import ConductorSchema, ConductorQuerySchema
from ..services.conductor_service import ConductorService
conductores_bp = Blueprint('conductores',__name__)
schema = ConductorSchema()
query_schema = ConductorQuerySchema()
@conductores_bp.route('', methods=['GET'])
@jwt_required()
def list_conductores():
    try:
        params = query_schema.load(request.args)
    except ValidationError as e:
        return jsonify({'error':'Parámetros inválidos','details':e.messages}), 400
    conductores, total, page, tp = ConductorService.get_all_paginated(params)
    return jsonify({'data':[c.to_dict(include_mototaxi=True) for c in conductores],'meta':{'total':total,'page':page,'per_page':params['per_page'],'total_pages':tp}}), 200
@conductores_bp.route('', methods=['POST'])
@jwt_required()
def create_conductor():
    try:
        data = schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({'error':'Datos inválidos','details':e.messages}), 400
    if ConductorService.get_by_codigo(data['codigo_afiliado']):
        return jsonify({'error':'Código de afiliado ya existe'}), 409
    if ConductorService.get_by_cedula(data['cedula_identidad']):
        return jsonify({'error':'Cédula ya registrada'}), 409
    c = ConductorService.create(data)
    return jsonify({'data':c.to_dict(),'message':'Conductor creado'}), 201
@conductores_bp.route('/<int:cid>', methods=['GET'])
@jwt_required()
def get_conductor(cid):
    c = ConductorService.get_by_id(cid)
    if not c: return jsonify({'error':'No encontrado'}), 404
    return jsonify({'data':c.to_dict(include_mototaxi=True)}), 200
@conductores_bp.route('/<int:cid>', methods=['PUT'])
@jwt_required()
def update_conductor(cid):
    c = ConductorService.get_by_id(cid)
    if not c: return jsonify({'error':'No encontrado'}), 404
    try:
        data = schema.load(request.get_json() or {}, partial=True)
    except ValidationError as e:
        return jsonify({'error':'Datos inválidos','details':e.messages}), 400
    if data.get('codigo_afiliado'):
        ex = ConductorService.get_by_codigo(data['codigo_afiliado'])
        if ex and ex.id != cid: return jsonify({'error':'Código ya existe'}), 409
    if data.get('cedula_identidad'):
        ex = ConductorService.get_by_cedula(data['cedula_identidad'])
        if ex and ex.id != cid: return jsonify({'error':'Cédula ya registrada'}), 409
    c = ConductorService.update(c, data)
    return jsonify({'data':c.to_dict(),'message':'Actualizado'}), 200
@conductores_bp.route('/<int:cid>', methods=['DELETE'])
@jwt_required()
def delete_conductor(cid):
    c = ConductorService.get_by_id(cid)
    if not c: return jsonify({'error':'No encontrado'}), 404
    ConductorService.delete(c)
    return jsonify({'message':'Eliminado'}), 200
