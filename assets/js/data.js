/* ============================================================
   LSG Beauty — données de la carte des soins
   Source : page Planity de l'institut (relevé du 5 novembre 2026).
   Format d'une ligne : [nom, durée, prix, remarque]
   prix : nombre (en €), chaîne libre, ou null (affiché « — »)
   ============================================================ */
window.LSG = {
  PLANITY: 'https://www.planity.com/lsg-beauty-04000-digne-les-bains-xe1',
  PHONE_LABEL: '04 92 31 19 08',
  PHONE_TEL: 'tel:+33492311908',
  groups: [
    /* ───────────────────────── ÉPILATION DÉFINITIVE ───────────────────────── */
    {
      id: 'laser',
      title: 'Épilation définitive',
      sub: 'Laser diode & Esthélyse',
      from: 40,
      cats: [
        {
          title: 'Esthélyse',
          intro: 'La dépilation définitive poil à poil. Elle convient à tous les types de peau, y compris les phototypes élevés et les poils blancs.',
          items: [
            ['1ère séance Esthélyse', '40 min', 45],
            ['Séance Esthélyse', '30 min', 45, 'Diagnostic obligatoire avant tout protocole de photodépilation ou d’épilation électrique']
          ]
        },
        {
          title: 'Épilation laser femme',
          intro: 'Laser diode, appareil certifié CE médical.',
          note: 'SIF : sillon inter-fessier.',
          items: [
            ['Diagnostic et flash test (première visite)', '15 min', null],
            ['Lèvre supérieure', '15 min', 40],
            ['Menton', '15 min', 40],
            ['Lèvre supérieure + menton', '20 min', 80],
            ['Visage', '20 min', 90],
            ['Aisselles', '15 min', 50],
            ['Maillot classique', '20 min', 75],
            ['Maillot échancré', '25 min', 95],
            ['Maillot intégral + SIF', '30 min', 120],
            ['SIF', '15 min', 40],
            ['Avant-bras', '25 min', 85, 'Coudes compris'],
            ['Bras entiers', '30 min', 115],
            ['Demi-jambes', '25 min', 135, 'Genoux et pieds compris'],
            ['Jambes entières + pieds', '35 min', 215],
            ['½ jambes + maillot simple + aisselles', '40 min', 200],
            ['½ jambes + maillot échancré + aisselles', '45 min', 220],
            ['½ jambes + maillot intégral + SIF + aisselles', '50 min', 295],
            ['Jambes entières + maillot échancré', '50 min', 300],
            ['Jambes entières + maillot intégral + SIF', '1 h 05', 320],
            ['Jambes entières + maillot simple + aisselles', '45 min', 310],
            ['Jambes entières + maillot échancré + aisselles', '1 h', 330],
            ['Jambes entières + maillot intégral + SIF + aisselles', '1 h 15', 370]
          ]
        },
        {
          title: 'Épilation laser homme',
          intro: 'Laser diode, appareil certifié CE médical.',
          items: [
            ['Aisselles', '15 min', 50],
            ['Épaules', '20 min', 70],
            ['Torse', '30 min', 120],
            ['Bas du dos', '25 min', 110],
            ['Dos entier', '35 min', 140],
            ['½ jambes', '25 min', 150],
            ['Jambes entières', '40 min', 230]
          ]
        }
      ]
    },

    /* ───────────────────────── ÉPILATION À LA CIRE ───────────────────────── */
    {
      id: 'cire',
      title: 'Épilation à la cire',
      sub: 'Perron Rigot & Epiloderm',
      from: 9,
      cats: [
        {
          title: 'Cire femme',
          intro: 'Cire française Perron Rigot Paris.',
          items: [
            ['Lèvre', '15 min', 9],
            ['Bas du visage', '15 min', 12],
            ['Visage complet', '25 min', 18, 'Lèvres et bas du visage'],
            ['Sourcils', '15 min', 10, 'Restructuration en option : + 10 €'],
            ['Restructuration des sourcils', '25 min', 19],
            ['Aisselles', '15 min', 11],
            ['Bras', '20 min', 15],
            ['Maillot classique', '15 min', 13],
            ['Maillot échancré', '20 min', 15],
            ['Maillot intégral', '25 min', 23],
            ['Maillot intégral + SIF', '30 min', 25],
            ['½ jambes', '20 min', 16],
            ['Jambes complètes', '30 min', 25],
            ['½ jambes + maillot simple + aisselles', '40 min', 34],
            ['½ jambes + maillot échancré + aisselles', '45 min', 38],
            ['½ jambes + maillot intégral + aisselles', '55 min', 46],
            ['Jambes complètes + maillot classique + aisselles', '50 min', 43],
            ['Jambes complètes + maillot échancré + aisselles', '50 min', 47],
            ['Jambes complètes + maillot intégral + aisselles', '1 h', 55]
          ]
        },
        {
          title: 'Cire Epiloderm femme',
          intro: 'Une cire à l’effet peeling immédiat : moins de poils sous la peau et une diminution progressive et durable du système pileux.',
          items: [
            ['Lèvre', '15 min', 10],
            ['Sourcils', '15 min', 12],
            ['Bas du visage', '20 min', 13],
            ['Visage complet', '25 min', 21],
            ['Restructuration + épilation des sourcils', '25 min', 20],
            ['Aisselles', '15 min', 12],
            ['Bras', '20 min', 18],
            ['Maillot classique', '20 min', 13],
            ['Maillot intégral', '30 min', 25],
            ['½ jambes', '25 min', 18],
            ['Jambes complètes', '35 min', 30],
            ['½ jambes + maillot classique + aisselles', '45 min', 36],
            ['½ jambes + maillot intégral + aisselles', '1 h', 48],
            ['Jambes complètes + maillot classique + aisselles', '1 h', 46],
            ['Jambes complètes + maillot intégral + aisselles', '1 h 10', 60]
          ]
        },
        {
          title: 'Cire homme',
          items: [
            ['Dos', '30 min', 25],
            ['Torse', '20 min', 20],
            ['Sourcils ou oreilles', '15 min', 10, '1 zone']
          ]
        },
        {
          title: 'Forfait spécial ado',
          intro: 'Pour les 12-17 ans.',
          items: [
            ['Forfait ½ jambes + maillot classique + aisselles', '30 min', 25]
          ]
        }
      ]
    },

    /* ───────────────────────── MINCEUR & DRAINAGE ───────────────────────── */
    {
      id: 'minceur',
      title: 'Minceur & drainage',
      sub: 'LPG, radiofréquence, Renata França',
      from: 20,
      cats: [
        {
          title: 'Cellu M6 Infinity',
          intro: 'La dernière génération d’endermologie LPG.',
          items: [
            ['Bilan personnalisé de début de cure', '30 min', null, 'Obligatoire avant toute cure'],
            ['Zone au choix', '25 min', 27.5],
            ['La séance', '45 min', 60],
            ['Cure de 10 séances', '50 min', 550]
          ]
        },
        {
          title: 'LPG Cellu M6 Intégral',
          intro: 'Endermologie corps.',
          call: true,
          note: 'Ces prestations ne se réservent pas en ligne : appelez-nous au 04 92 31 19 08.',
          items: [
            ['À la séance', '45 min', 50],
            ['Forfait 10 séances + collant + bilan', '45 min', 450],
            ['Forfait 20 séances + collant + bilan', '45 min', 840]
          ]
        },
        {
          title: 'Radiofréquence corps',
          items: [
            ['Bosse de bison', '20 min', 35],
            ['Banane sous-fessière', '25 min', 35],
            ['Culotte de cheval', '30 min', 40],
            ['Intérieur des cuisses', '30 min', 35],
            ['Genoux', '25 min', 35],
            ['Bras', '45 min', 40],
            ['Abdomen central', '30 min', 40],
            ['Abdomen + poignées d’amour', '45 min', 60],
            ['Fesses', '45 min', 65],
            ['Cuisses entières', '50 min', 70]
          ]
        },
        {
          title: 'Combiné minceur LPG + RF',
          items: [
            ['Spécial abdomen', '50 min', 67, '15 min de LPG + 15 min de radiofréquence tripolaire'],
            ['Spécial cellulite', '1 h', 77, '20 min de LPG + 15 min de radiofréquence tripolaire']
          ]
        },
        {
          title: 'Biosliming Active Wrap',
          intro: 'Un enveloppement amincissant innovant, qui se concentre sur la réduction de la cellulite et de la graisse.',
          items: [
            ['Active Wrap, 1 zone', '1 h', 60, 'Abdomen ou cuisses'],
            ['Active Wrap, 2 zones', '1 h', 75, 'Abdomen et cuisses'],
            ['Soin détox ventre', '1 h', 55],
            ['Soin détox complet', '1 h', 105]
          ]
        },
        {
          title: 'Méthode Renata França',
          intro: 'Drainage lymphatique du corps.',
          items: [
            ['Drainage lymphatique, corps', '1 h 15', 130],
            ['Cure de 3 séances', '1 h 15', 330],
            ['Cure de 5 séances', '1 h 15', 550]
          ]
        },
        {
          title: 'Soin détox énergétique',
          items: [
            ['Modelage détoxifiant abdomen', '40 min', 55, '30 min de modelage'],
            ['Modelage détoxifiant corps complet', '1 h 10', 105, '60 min de modelage']
          ]
        },
        {
          title: 'Cryocell',
          items: [
            ['La séance, 1 ventouse', '1 h', 50, 'Une zone'],
            ['La séance, 2 ventouses', '1 h', 70, 'Deux zones']
          ]
        },
        {
          title: 'Pressothérapie',
          items: [
            ['Soin jambes lourdes', '30 min', 25]
          ]
        },
        {
          title: 'Bilan minceur',
          intro: 'Biody Coach.',
          items: [
            ['Protocole sur mesure', '30 min', 20]
          ]
        }
      ]
    },

    /* ───────────────────────── VISAGE & ANTI-ÂGE ───────────────────────── */
    {
      id: 'visage',
      title: 'Visage & anti-âge',
      sub: 'Peeling, microneedling, OxyGénéo, LPG',
      from: 30,
      cats: [
        {
          title: 'Soins du visage',
          items: [
            ['Soin relaxant du visage', '1 h', 70, 'Gommage, modelage, masque à l’acide hyaluronique, crème de jour'],
            ['Soin purifiant', '1 h', 75, 'Sous vapozone'],
            ['Option modelage pieds / mains', '15 min', 15],
            ['Soin purifiant spécial ado', '45 min', 55, '12-17 ans']
          ]
        },
        {
          title: 'Soins du visage LPG Alliance',
          items: [
            ['Soin éclat express', '25 min', 30, '15 min d’endermologie visage, sur la zone de votre choix'],
            ['Soin lift anti-âge', '45 min', 60, 'Repulpant, fermeté, affinant · 30 min d’endermologie visage'],
            ['Soin sublime regard et lèvres', '50 min', 60, '40 min d’endermologie regard et lèvres'],
            ['Soin signature', '1 h', 80, '30 min d’endermologie, gommage et pose de masque'],
            ['Forfait endermologie visage', '45 min', 500, '30 min d’endermologie visage']
          ]
        },
        {
          title: 'Radiofréquence visage',
          items: [
            ['Visage complet', '45 min', 70],
            ['Spécial regard', '30 min', 35],
            ['Spécial contour des lèvres', '30 min', 35],
            ['Double menton, cou et décolleté', '30 min', 50]
          ]
        },
        {
          title: 'OxyGénéo',
          intro: 'Le soin qui exfolie la peau en profondeur et la réoxygène : trois actions en une, exfoliation, oxygénation et infusion de principes actifs.',
          items: [
            ['OxyGénéo', '50 min', 80],
            ['Cure de 3 soins OxyGénéo', '50 min', 210],
            ['Radiofréquence + OxyGénéo', '1 h 15', 100]
          ]
        },
        {
          title: 'Peeling Noon',
          items: [
            ['Peeling anti-âge, anti-taches', '1 h', 100],
            ['Peeling peaux jeunes', '40 min', 70, 'Traitement des peaux jeunes à problèmes'],
            ['Radiofréquence Maximus + peeling', '1 h 15', 130],
            ['Soin zone contour de la bouche', '45 min', 60, 'Radiofréquence + peeling'],
            ['Soin zone contour des yeux', '45 min', 60, 'Radiofréquence + peeling']
          ]
        },
        {
          title: 'Microneedling Dermapen Pro / BB Glow',
          items: [
            ['Microneedling', '1 h', 110],
            ['Microneedling + booster', '1 h', 130],
            ['Microneedling + booster + peeling', '1 h 15', 140],
            ['Microneedling + traitement Hydro Deluxe', '1 h 10', 150],
            ['Peeling + microneedling Hydro Deluxe', '1 h 15', 180]
          ]
        },
        {
          title: 'Microneedling cheveux · Hair Boost',
          intro: 'Un soin spécifique pour la chute des cheveux : il améliore la circulation sanguine du cuir chevelu et favorise la repousse capillaire.',
          items: [
            ['Microneedling cheveux Boost’Hair', '40 min', 110],
            ['Forfait 6 séances Hair Boost', '45 min', 600]
          ]
        }
      ]
    },

    /* ───────────────────────── BEAUTÉ DU REGARD ───────────────────────── */
    {
      id: 'regard',
      title: 'Beauté du regard',
      sub: 'Cils & sourcils',
      from: 20,
      cats: [
        {
          title: 'Cils & sourcils',
          items: [
            ['Rehaussement des cils avec teinture', '1 h 20', 65, 'Rehaussement + teinture + soin botulash'],
            ['Teinture des cils et/ou sourcils', '20 min', 20],
            ['Restructuration des sourcils + teinture', '30 min', 30]
          ]
        }
      ]
    },

    /* ───────────────────────── MAINS & PIEDS ───────────────────────── */
    {
      id: 'mains',
      title: 'Mains & pieds',
      sub: 'Semi-permanent, spa des pieds',
      from: 15,
      cats: [
        {
          title: 'Vernis semi-permanent',
          items: [
            ['Pose mains', '1 h', 30],
            ['Forfait dépose + pose mains', '1 h 10', 36],
            ['Dépose seule mains', '15 min', 15],
            ['Pose pieds', '1 h', 27],
            ['Forfait dépose + pose pieds', '1 h 05', 33],
            ['Dépose seule pieds', '15 min', 15],
            ['Manucure simple', '20 min', 25, 'Sans pose de vernis'],
            ['Supplément dépose mains / gel extérieur', '30 min', 21, 'Si la pose initiale a été réalisée dans un autre institut']
          ]
        },
        {
          title: 'Spa des pieds',
          items: [
            ['Pouf de réflexologie plantaire Yakha Massage', '30 min', 15, 'Rollers shiatsu, airbags et oscillation : les pieds dégonflent en 10 minutes'],
            ['Spa des pieds Pro Nails', '55 min', 55, 'Nettoyer, exfolier, traiter, avec des actifs naturels'],
            ['Spa des pieds Pro Nails + vernis semi-permanent', '1 h 40', 75, 'Pouf de réflexologie offert en fin de soin']
          ]
        }
      ]
    },

    /* ───────────────────────── CORPS & DÉTENTE ───────────────────────── */
    {
      id: 'corps',
      title: 'Corps & détente',
      sub: 'Modelages & gommages',
      from: 29,
      cats: [
        {
          title: 'Soins du corps',
          items: [
            ['Modelage relaxant, zone au choix', '40 min', 30, '30 min de modelage'],
            ['Modelage relaxant corps complet', '1 h 10', 60, '60 min de modelage'],
            ['Soin dos parfait', '1 h', 70, 'Savon noir, gommage, modelage, vapozone, masque'],
            ['Gommage corps', '30 min', 29]
          ]
        }
      ]
    },

    /* ───────────────────────── BRONZAGE UV ───────────────────────── */
    {
      id: 'uv',
      title: 'Bronzage UV',
      sub: 'Cabine UV',
      from: 10,
      cats: [
        {
          title: 'Séances UV',
          intro: 'Réservé aux personnes majeures. Lunettes de protection fournies. L’exposition aux UV peut provoquer des cancers de la peau et des yeux et un vieillissement cutané prématuré ; certains médicaments et cosmétiques augmentent la sensibilité.',
          items: [
            ['1ère séance UV + examen de la peau', '15 min', 'de 5 à 30 €', '1 € la minute. Créneau bloqué 30 min : la durée est fixée par l’institut selon votre phototype'],
            ['Séance UV 10 minutes', '10 min', 10],
            ['Séance UV 15 minutes', '15 min', 15],
            ['Séance UV 20 minutes', '20 min', 20],
            ['Séance UV 25 minutes', '25 min', 25],
            ['Séance UV 30 minutes', '30 min', 30]
          ]
        }
      ]
    }
  ]
};
