from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from ..services.dashboard_service import DashboardService
dashboard_bp = Blueprint('dashboard',__name__)
@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def stats():
    return jsonify({'data':DashboardService.get_dashboard_stats()}), 200
