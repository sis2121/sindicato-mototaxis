from datetime import datetime, timezone
from ..extensions import db
class Conductor(db.Model):
    __tablename__ = 'conductores'
    id = db.Column(db.Integer, primary_key=True)
    codigo_afiliado = db.Column(db.String(20), unique=True, nullable=False, index=True)
    nombres = db.Column(db.String(100), nullable=False)
    apellidos = db.Column(db.String(100), nullable=False)
    cedula_identidad = db.Column(db.String(20), unique=True, nullable=False, index=True)
    telefono = db.Column(db.String(15))
    direccion = db.Column(db.String(255))
    fecha_nacimiento = db.Column(db.Date)
    licencia_conducir = db.Column(db.String(30))
    categoria_licencia = db.Column(db.String(10))
    fecha_afiliacion = db.Column(db.Date)
    estado = db.Column(db.String(20), default='ACTIVO', nullable=False, index=True)
    fotografia = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    mototaxi = db.relationship('Mototaxi', backref='conductor', uselist=False, lazy='joined', cascade='all, delete-orphan')
    __table_args__ = (db.CheckConstraint("estado IN ('ACTIVO','SUSPENDIDO','RETIRADO')", name='ck_conductores_estado'),)
    def to_dict(self, include_mototaxi=False):
        data = {
            'id':self.id,'codigo_afiliado':self.codigo_afiliado,'nombres':self.nombres,'apellidos':self.apellidos,
            'nombre_completo':f"{self.nombres} {self.apellidos}",'cedula_identidad':self.cedula_identidad,
            'telefono':self.telefono,'direccion':self.direccion,
            'fecha_nacimiento':self.fecha_nacimiento.isoformat() if self.fecha_nacimiento else None,
            'licencia_conducir':self.licencia_conducir,'categoria_licencia':self.categoria_licencia,
            'fecha_afiliacion':self.fecha_afiliacion.isoformat() if self.fecha_afiliacion else None,
            'estado':self.estado,'fotografia':self.fotografia,
            'created_at':self.created_at.isoformat() if self.created_at else None,
            'updated_at':self.updated_at.isoformat() if self.updated_at else None
        }
        if include_mototaxi and self.mototaxi:
            data['mototaxi'] = self.mototaxi.to_dict()
        return data
