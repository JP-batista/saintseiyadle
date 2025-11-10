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
                gifSrc: "/dle/attacks/meteoro_de_pegaso.gif",
            },
            {
                idAttack: "meteoro_pegaso_los", 
                name: "Meteoro de Pégaso (Lenda do Santuario)",
                gifSrc: "/dle/attacks/meteoro_de_pegaso_los.gif",
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
                idAttack: "colera_do_dragao", 
                name: "Colera do Dragão",
                gifSrc: "/dle/attacks/colera_do_dragao.gif",
            },
        ]
    },
    {
        idKey: "hyoga",
        nome: "Hyoga de Cisne",
        patente: "Cavaleiro de Bronze",
        imgSrc: "/dle/characters/hyoga.jpg",
        attacks: [
            {
                idAttack: "po_de_diamante", 
                name: "Pó de Diamante",
                gifSrc: "/dle/attacks/po_de_diamante.gif",
            },
        ]  
      },
];

export default attacks;