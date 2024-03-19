import { GithubUser } from "./GithubUser.js";

// classe que vai conter a lógica dos dados
// como os dados  serão estruturados
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

        
        console.log(this.entries);
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }


    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if (userExists) {
                throw new Error('Usuário já cadastrado')
            }

            const user = await GithubUser.search(username)
            
            if (user.login === undefined) {
                throw new Error('Usuário não encontrado')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        } catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        // Higher-order functions
        const filteredEntries = this.entries
            .filter(entry => entry.login !== user.login)
        this.entries = filteredEntries
        this.update()
        this.save()
    }

    
}

//classe que vai criar a visualização e eventos do html
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody');
        this.noOne = this.root.querySelector('.noOne');

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')

        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
            
            this.add(value)
            this.noOne.classList.add('hide')
            this.tbody.classList.remove('table-noOne')
        }

    }


    update () {
        this.removeAllTr()
        if (this.entries.length == 0) {
            this.noOne.classList.remove('hide')
            this.tbody.classList.add('table-noOne')
        }

        this.entries.forEach(user => {
            const row = this.createRow()
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user a').target = "_blank"
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja dele tar essa linha')
                if (isOk) {
                     this.delete(user)
                }
            }


            this.tbody.append(row)
        })
        
    }


    createRow () {
        const tr = document.createElement('tr') 

        tr.innerHTML = `
        <tr>
        <td class="user">
            <img src="https://github.com/ONJoaop.png" alt="">
            <a href="">
                <p>João Paulo Barboza dos Santos</p>
                <span>/ONJoaop</span>
            </a>
        </td>
        <td class="repositories">
            12
        </td>
        <td class="followers">
            0
        </td>
        <td>
            <button class="remove">Remover</button>
        </td>
    </tr>
        `

        return tr
    }

    removeAllTr() {
        
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            });
    }
    
}
