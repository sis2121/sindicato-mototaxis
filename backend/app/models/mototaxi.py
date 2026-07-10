from datetime import datetime, timezone
from ..extensions import db
class Mototaxi(db.Model):
    __tablename__ = 'mototaxis'
    id = db.Column(db.Integer, primary_key=True)
    conductor_id = db.Column(db.Integer, db.ForeignKey('conductores.id', ondelete='SET NULL'), unique=True, nullable=True, index=True)
    placa = db.Column(db.String(10), unique=True, nullable=False, index=True)
    marca = db.Column(db.String(50), nullable=False)
    modelo = db.Column(db.String(50))
    color = db.Column(db.String(30))
    año = db.Column(db.Integer)
    numero_motor = db.Column(db.String(50))
    estado = db.Column(db.String(20), default='ACTIVO', nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    __table_args__ = (db.CheckConstraint("estado IN ('ACTIVO','EN_REPARACION','FUERA_SERVICIO')", name='ck_mototaxis_estado'),)
    def to_dict(self, include_conductor=False):
        data = {
            'id':self.id,'conductor_id':self.conductor_id,'placa':self.placa,'marca':self.marca,
            'modelo':self.modelo,'color':self.color,'año':self.año,'numero_motor':self.numero_motor,
            'estado':self.estado,
            'created_at':self.created_at.isoformat() if self.created_at else None,
            'updated_at':self.updated_at.isoformat() if self.updated_at else None
        }
        if include_conductor and self.conductor:
            data['conductor'] = {'id':self.conductor.id,'codigo_afiliado':self.conductor.codigo_afiliado,'nombre_completo':f"{self.conductor.nombres} {self.conductor.apellidos}"}
        return data
