from typing import Tuple, List, Dict, Any
from sqlalchemy import or_
from ..extensions import db
from ..models.mototaxi import Mototaxi
from ..models.conductor import Conductor   # <-- nuevo import

class MototaxiService:
    @staticmethod
    def get_all_paginated(params):
        page = params.get('page', 1)
        per_page = params.get('per_page', 10)
        search = params.get('search', '').strip()
        estado = params.get('estado', '').strip()
        sort_by = params.get('sort_by', 'created_at')
        sort_order = params.get('sort_order', 'desc')

        q = Mototaxi.query
        if estado:
            q = q.filter(Mototaxi.estado == estado)
        if search:
            s = f'%{search}%'
            q = q.filter(or_(Mototaxi.placa.ilike(s), Mototaxi.marca.ilike(s),
                             Mototaxi.modelo.ilike(s), Mototaxi.numero_motor.ilike(s)))
        allowed = {'placa', 'marca', 'modelo', 'año', 'estado', 'created_at'}
        if sort_by not in allowed:
            sort_by = 'created_at'
        col = getattr(Mototaxi, sort_by)
        q = q.order_by(col.desc() if sort_order == 'desc' else col.asc())
        total = q.count()
        tp = max(1, (total + per_page - 1) // per_page)
        motos = q.offset((page - 1) * per_page).limit(per_page).all()
        return motos, total, page, tp

    @staticmethod
    def get_by_id(mid):
        return db.session.get(Mototaxi, mid)

    @staticmethod
    def get_by_placa(placa):
        return Mototaxi.query.filter_by(placa=placa).first()

    @staticmethod
    def _resolve_conductor_id(data: dict) -> dict:
        """Si viene codigo_afiliado, buscar el conductor y reemplazar por conductor_id."""
        codigo = data.pop('codigo_afiliado', None)
        if codigo:
            conductor = Conductor.query.filter_by(codigo_afiliado=codigo).first()
            if not conductor:
                raise ValueError(f"No existe un conductor con código de afiliado '{codigo}'")
            data['conductor_id'] = conductor.id
        else:
            # Si no se envió código, mantener el conductor_id que venga (puede ser None)
            pass
        return data

    @staticmethod
    def create(data: dict) -> Mototaxi:
        data = MototaxiService._resolve_conductor_id(data)
        m = Mototaxi(**data)
        db.session.add(m)
        db.session.commit()
        return m

    @staticmethod
    def update(m: Mototaxi, data: dict) -> Mototaxi:
        data = MototaxiService._resolve_conductor_id(data)
        for k, v in data.items():
            if hasattr(m, k):
                setattr(m, k, v)
        db.session.commit()
        return m

    @staticmethod
    def delete(m: Mototaxi) -> None:
        db.session.delete(m)
        db.session.commit()

    @staticmethod
    def get_stats():
        t = Mototaxi.query.count()
        a = Mototaxi.query.filter_by(estado='ACTIVO').count()
        r = Mototaxi.query.filter_by(estado='EN_REPARACION').count()
        f = Mototaxi.query.filter_by(estado='FUERA_SERVICIO').count()
        asig = Mototaxi.query.filter(Mototaxi.conductor_id.isnot(None)).count()
        return {'total': t, 'activas': a, 'en_reparacion': r,
                'fuera_servicio': f, 'asignadas': asig, 'no_asignadas': t - asig}