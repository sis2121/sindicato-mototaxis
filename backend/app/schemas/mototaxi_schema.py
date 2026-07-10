from marshmallow import Schema, fields, validate

class MototaxiSchema(Schema):
    id = fields.Int(dump_only=True)
    conductor_id = fields.Int(allow_none=True, load_default=None)
    placa = fields.String(required=True, validate=validate.Length(min=3, max=10))
    marca = fields.String(required=True, validate=validate.Length(min=2, max=50))
    modelo = fields.String(allow_none=True, validate=validate.Length(max=50))
    color = fields.String(allow_none=True, validate=validate.Length(max=30))
    año = fields.Int(allow_none=True, validate=validate.Range(min=1900, max=2100))
    numero_motor = fields.String(allow_none=True, validate=validate.Length(max=50))
    estado = fields.String(validate=validate.OneOf(['ACTIVO', 'EN_REPARACION', 'FUERA_SERVICIO']))
    codigo_afiliado = fields.String(load_only=True, allow_none=True)   # <--- AÑADIR ESTA LÍNEA
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    conductor = fields.Dict(dump_only=True)

class MototaxiQuerySchema(Schema):
    search = fields.String(allow_none=True)
    estado = fields.String(allow_none=True)
    page = fields.Int(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Int(load_default=10, validate=validate.Range(min=1, max=100))
    sort_by = fields.String(load_default='created_at')
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc', 'desc']))