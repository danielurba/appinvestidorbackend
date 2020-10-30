const bcrypt = require('bcrypt')

module.exports = app => {

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const getUser = { ...req.body }

        if(!getUser.user || !getUser.email) return res.status(400).send({ msg: 'Informar Nome/Email'})
        if(!getUser.password) return res.status(400).send({ msg: 'Informe uma senha !'})

        const emailTrue = await app.db('users')
            .where({ email: getUser.email })
            .first()
        
        if(emailTrue) return res.status(400).send({ msg: 'Email já esta cadastrado !'})

        getUser.password = encryptPassword(getUser.password)

        if(getUser) {
            app.db('users')
                .insert(getUser, ['money', 'playday', 'email'])
                .then(list => {
                    const store = {
                        money: list[0].money,
                        playday: list[0].playday,
                        email: list[0].email
                    }
                    res.json({...store})
                })
                .catch(err => res.status(400).send(err))
        }
    }

    const saveaccount = async (req, res) => {
        const informs = { ...req.body }
        
        if(informs.money) {
            await app.db('users')
                .where({ email: informs.email })
                .update({ playday: informs.playday, money: informs.money })
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).send(err))
        }
        if(informs.idArray) {
            await app.db('users')
                .where({ email: informs.email })
                .update({ playday: informs.playday, idArray: informs.idArray })
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).send(err))
        }
        if(informs.date) {
            await app.db('users')
                .where({ email: informs.email })
                .update({ date: informs.date })
                .then(_ => res.status(204).send())
                .catch(err => res.status(400).send(err))
        }
    }

    const getdatetoplay = async (req, res) => {
        const information = { ...req.body }

        const getdate = await app.db('users')
            .where({ email: information.email })
            .first()
            
        const store = {
            date: getdate.date
        }

        res.json({ ...store })
    }

    const get = (req, res) => {
        app.db('users')
            .select('user', 'money')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        const user = { ...req.body }

        const getUser = await app.db('users')
            .where({email: user.email})
            .first()

        if(!getUser) return res.status(400).send({ msg: 'Usuario já excluido !'})

        const isTrue = bcrypt.compareSync(user.password, getUser.password)

        if(!isTrue) return res.status(401).send({ msg: 'Usuário/Senha inválidos !'})

        if(isTrue) {
            app.db('users')
                .where({email: user.email})
                .del()
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const resetar = async (req, res) => {
        const user = { ...req.body }

        const getUser = await app.db('users')
            .where({email: user.email})
            .first()

        const isTrue = bcrypt.compareSync(user.password, getUser.password)

        if(!isTrue) return res.status(401).send({ msg: 'Usuário/Senha inválidos !'})

        if(isTrue) {
            app.db('users')
                .where({email: user.email})
                .update({ money: '100000'})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    return { save, saveaccount , get, remove, getdatetoplay, resetar }
}