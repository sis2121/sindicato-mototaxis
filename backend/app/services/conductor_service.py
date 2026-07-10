from typing import Tuple, List, Dict, Any
from sqlalchemy import or_, func
from ..extensions import db
from ..models.conductor import Conductor
from datetime import datetime, timezone, timedelta

class ConductorService:
    @staticmethod
    def get_all_paginated(query_params: dict) -> Tuple[List[Conductor], int, int, int]:
        page = query_params.get('page', 1)
        per_page = query_params.get('per_page', 10)
        search = query_params.get('search', '').strip()
        estado = query_params.get('estado', '').strip()
        sort_by = query_params.get('sort_by', 'created_at')
        sort_order = query_params.get('sort_order', 'desc')

        query = Conductor.query
        if estado:
            query = query.filter(Conductor.estado == estado)
        if search:
            search_term = f'%{search}%'
            query = query.filter(
                or_(
                    Conductor.nombres.ilike(search_term),
                    Conductor.apellidos.ilike(search_term),
                    Conductor.codigo_afiliado.ilike(search_term),
                    Conductor.cedula_identidad.ilike(search_term),
                    Conductor.telefono.ilike(search_term),
                )
            )

        allowed_sort_columns = {
            'codigo_afiliado', 'nombres', 'apellidos', 'cedula_identidad',
            'estado', 'fecha_afiliacion', 'created_at', 'updated_at'
        }
        if sort_by not in allowed_sort_columns:
            sort_by = 'created_at'

        sort_column = getattr(Conductor, sort_by)
        if sort_order == 'desc':
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())

        total = query.count()
        total_pages = max(1, (total + per_page - 1) // per_page)
        conductores = query.offset((page - 1) * per_page).limit(per_page).all()

        return conductores, total, page, total_pages

    @staticmethod
    def get_by_id(conductor_id: int) -> Conductor | None:
        return db.session.get(Conductor, conductor_id)

    @staticmethod
    def get_by_codigo(codigo_afiliado: str) -> Conductor | None:
        return Conductor.query.filter_by(codigo_afiliado=codigo_afiliado).first()

    @staticmethod
    def get_by_cedula(cedula_identidad: str) -> Conductor | None:
        return Conductor.query.filter_by(cedula_identidad=cedula_identidad).first()

    @staticmethod
    def create(data: dict) -> Conductor:
        conductor = Conductor(**data)
        db.session.add(conductor)
        db.session.commit()
        return conductor

    @staticmethod
    def update(conductor: Conductor, data: dict) -> Conductor:
        for key, value in data.items():
            if hasattr(conductor, key):
                setattr(conductor, key, value)
        db.session.commit()
        return conductor

    @staticmethod
    def delete(conductor: Conductor) -> None:
        db.session.delete(conductor)
        db.session.commit()

    @staticmethod
    def get_stats() -> Dict[str, Any]:
        total = Conductor.query.count()
        activos = Conductor.query.filter_by(estado='ACTIVO').count()
        suspendidos = Conductor.query.filter_by(estado='SUSPENDIDO').count()
        retirados = Conductor.query.filter_by(estado='RETIRADO').count()

        doce_meses_atras = datetime.now(timezone.utc) - timedelta(days=365)

        # CAMBIO: usar fecha_afiliacion en lugar de created_at
        registros_por_mes = db.session.query(
            func.date_trunc('month', Conductor.fecha_afiliacion).label('mes'),
            func.count(Conductor.id).label('total')
        ).filter(
            Conductor.fecha_afiliacion.isnot(None),
            Conductor.fecha_afiliacion >= doce_meses_atras
        ).group_by('mes').order_by('mes').all()

        return {
            'total': total,
            'activos': activos,
            'suspendidos': suspendidos,
            'retirados': retirados,
            'registros_por_mes': [
                {'mes': r.mes.strftime('%Y-%m'), 'total': r.total}
                for r in registros_por_mes
            ],
            'estados_distribucion': [
                {'estado': 'ACTIVO', 'cantidad': activos},
                {'estado': 'SUSPENDIDO', 'cantidad': suspendidos},
                {'estado': 'RETIRADO', 'cantidad': retirados},
            ]
        }