from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from ..schemas.auth_schema import LoginSchema
from ..services.auth_service import AuthService
auth_bp = Blueprint('auth',__name__)
login_schema = LoginSchema()
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = login_schema.load(request.get_json() or {})
    except ValidationError as e:
        return jsonify({'error':'Datos inválidos','details':e.messages}), 400
    result = AuthService.login(email=data['email'], password=data['password'])
    if not result:
        return jsonify({'error':'Credenciales inválidas'}), 401
    return jsonify({'message':'Inicio exitoso','access_token':result['access_token'],'usuario':result['usuario']}), 200
