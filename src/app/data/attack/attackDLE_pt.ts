// src/data/attack/attackDLE_pt.ts

const attacks = [
    {
        idKey: "seiya",
        nome: "Seiya de Pégaso",
        patente: "Cavaleiro de Bronze",
        imgSrc: "/dle/characters/seiya.jpg",
        attacks: [
            {
                idAttack: "meteoro_pegaso", 
                name: "Meteoro de Pégaso",
                gifSrc: "/dle/characters/attacks/seiya/meteoro_de_pegaso.gif",
            },
            {
                idAttack: "cometa_pegaso",
                name: "Cometa de Pégaso",
                gifSrc: "/dle/characters/attacks/seiya/cometa_de_pegaso.gif",
            },
        ]
    },
    {
        idKey: "shiryu",
        nome: "Shiryu de Dragão",
        patente: "Cavaleiro de Bronze",
        imgSrc: "/dle/characters/shiryu.jpg",
        attacks: [
            {
                idAttack: "colera_dragao",
                name: "Cólera do Dragão",
                gifSrc: "/dle/characters/attacks/shiryu/colera_do_dragao.gif",
            },
        ]
    },
];

export default attacks;