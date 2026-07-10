from .conductor_service import ConductorService
from .mototaxi_service import MototaxiService
class DashboardService:
    @staticmethod
    def get_dashboard_stats():
        return {'conductores':ConductorService.get_stats(),'mototaxis':MototaxiService.get_stats()}
