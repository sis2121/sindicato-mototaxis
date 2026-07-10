from app import create_app
from app.extensions import db
from app.models.usuario import Usuario
app = create_app()
with app.app_context():
    db.create_all()
    if not Usuario.query.filter_by(email='admin@sindicato.bo').first():
        admin = Usuario(nombre='Administrador', email='admin@sindicato.bo', rol='admin')
        admin.set_password('Admin123!')
        db.session.add(admin)
        db.session.commit()
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
