from ..extensions import db
from ..models.usuario import Usuario
from flask_jwt_extended import create_access_token
class AuthService:
    @staticmethod
    def login(email, password):
        usuario = Usuario.query.filter_by(email=email).first()
        if not usuario or not usuario.check_password(password):
            return None
        access_token = create_access_token(identity=str(usuario.id), additional_claims={'email':usuario.email,'rol':usuario.rol,'nombre':usuario.nombre})
        return {'access_token':access_token,'usuario':usuario.to_dict()}
