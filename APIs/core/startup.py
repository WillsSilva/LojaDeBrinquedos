from core.auth import hash_password
from core.database import db


def criar_usuario_admin_padrao():
    usuario_admin = db.funcionarios.find_one({'username': 'admin'})
    if not usuario_admin:
        db.funcionarios.insert_one(
            {
                'username': 'admin',
                'password': hash_password('123'),
                'role': 'admin',
                'nome': 'Administrador Padrão',
                'cpf': '00000000000',
                'telefone': '000000000',
            }
        )
        print('Usuário admin criado com sucesso.')
    else:
        print('Usuário admin já existe.')
