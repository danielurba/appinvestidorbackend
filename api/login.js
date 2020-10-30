const bcrypt = require('bcrypt')

module.exports = app => {

    const login = async (req, res) => {
        const reqUser = { ...req.body }

        if(!reqUser.email || !reqUser.password) {
            return res.status(400).send({ msg: 'Informar Usuário e Senha !'})
        }

        const getUser = await app.db('users')
            .where({ email: reqUser.email })
            .first()
        
        if(!getUser) return res.status(400).send({ msg: 'Usuário não encontrado !'})
        
        const isTrue = bcrypt.compareSync(reqUser.password, getUser.password)
        if(!isTrue) return res.status(401).send({ msg: 'Usuário/Senha inválidos !'})

        const store = {
            user: getUser.user,
            playday: getUser.playday,
            money: getUser.money,
            email: getUser.email,
            idArray: getUser.idArray
        }

        res.json({ ...store })
    }

    return { login }
}