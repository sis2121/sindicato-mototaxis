import os
from flask import Flask, send_from_directory
from .extensions import db, migrate, jwt, cors
from .config import config_by_name


def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads')

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Blueprints
    from .routes.auth import auth_bp
    from .routes.conductores import conductores_bp
    from .routes.mototaxis import mototaxis_bp
    from .routes.dashboard import dashboard_bp
    from .routes.upload import upload_bp
    

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(conductores_bp, url_prefix='/api/conductores')
    app.register_blueprint(mototaxis_bp, url_prefix='/api/mototaxis')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(upload_bp)
    

    # Servir archivos subidos
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app