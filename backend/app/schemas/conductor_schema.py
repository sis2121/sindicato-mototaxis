from marshmallow import Schema, fields, validate, pre_load
class ConductorSchema(Schema):
    id = fields.Int(dump_only=True)
    codigo_afiliado = fields.String(required=True, validate=validate.Length(min=3, max=20))
    nombres = fields.String(required=True, validate=validate.Length(min=2, max=100))
    apellidos = fields.String(required=True, validate=validate.Length(min=2, max=100))
    cedula_identidad = fields.String(required=True, validate=validate.Length(min=5, max=20))
    telefono = fields.String(allow_none=True, validate=validate.Length(max=15))
    direccion = fields.String(allow_none=True, validate=validate.Length(max=255))
    fecha_nacimiento = fields.Date(allow_none=True)
    licencia_conducir = fields.String(allow_none=True, validate=validate.Length(max=30))
    categoria_licencia = fields.String(allow_none=True, validate=validate.Length(max=10))
    fecha_afiliacion = fields.Date(allow_none=True)
    estado = fields.String(validate=validate.OneOf(['ACTIVO','SUSPENDIDO','RETIRADO']))
    fotografia = fields.String(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    nombre_completo = fields.String(dump_only=True)
    mototaxi = fields.Dict(dump_only=True)
    @pre_load
    def process_dates(self, data, **kwargs):
        for f in ['fecha_nacimiento','fecha_afiliacion']:
            if f in data and (data[f]=='' or data[f] is None):
                data[f] = None
        return data
class ConductorQuerySchema(Schema):
    search = fields.String(allow_none=True)
    estado = fields.String(allow_none=True, validate=validate.OneOf(['ACTIVO','SUSPENDIDO','RETIRADO','']))
    page = fields.Int(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Int(load_default=10, validate=validate.Range(min=1, max=100))
    sort_by = fields.String(load_default='created_at')
    sort_order = fields.String(load_default='desc', validate=validate.OneOf(['asc','desc']))
