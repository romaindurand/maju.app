# Application de Sondage par Jugement Majoritaire

Une application web complète pour créer et gérer des sondages utilisant le système de vote par jugement majoritaire.

## 🚀 Démarrage rapide

### 1. Configuration de la base de données

```bash
# Générer le client Prisma
pnpm db:generate

# Créer la base de données et appliquer le schéma
pnpm db:push
```

### 2. Lancer l'application

```bash
pnpm dev
```

L'application sera accessible sur `http://localhost:5173`

## 📋 Fonctionnalités

- ✅ Création de sondages avec candidats personnalisés
- ✅ Vote par jugement majoritaire avec échelle de 7 mentions
- ✅ Prévention des votes multiples (fingerprinting + localStorage + cookies)
- ✅ Calcul automatique des résultats avec le package `maju`
- ✅ Interface moderne et responsive
- ✅ Base de données SQLite avec Prisma ORM

## 🗳️ Le Jugement Majoritaire

Le jugement majoritaire est un système de vote où chaque votant évalue tous les candidats sur une échelle de mentions :

1. **Excellent**
2. **Très bien**
3. **Bien**
4. **Assez bien**
5. **Passable**
6. **Insuffisant**
7. **À rejeter**

Le gagnant est celui qui obtient la meilleure **mention majoritaire** (médiane).

## 🛠️ Technologies utilisées

- **Frontend**: SvelteKit 2 + Svelte 5
- **Backend**: SvelteKit API routes
- **Base de données**: SQLite + Prisma ORM
- **Vote**: Package `maju` pour le calcul du jugement majoritaire
- **Sécurité**: Fingerprinting navigateur + localStorage + cookies

## 📁 Structure du projet

```
src/
├── lib/
│   ├── components/
│   │   ├── PollCreator.svelte      # Création de sondages
│   │   ├── VotingInterface.svelte  # Interface de vote
│   │   └── ResultsDisplay.svelte   # Affichage des résultats
│   ├── server/
│   │   └── db.ts                   # Client Prisma
│   ├── utils/
│   │   ├── fingerprint.ts          # Fingerprinting navigateur
│   │   └── voter.ts                # Identification des votants
│   └── config.ts                   # Configuration (échelle de notes)
├── routes/
│   ├── +page.svelte                # Page d'accueil
│   ├── api/
│   │   └── polls/                  # API endpoints
│   └── poll/
│       └── [id]/                   # Pages de vote et résultats
└── prisma/
    └── schema.prisma               # Schéma de base de données
```

## 🔧 Scripts disponibles

- `pnpm dev` - Lancer le serveur de développement
- `pnpm build` - Construire pour la production
- `pnpm db:generate` - Générer le client Prisma
- `pnpm db:push` - Appliquer le schéma à la base de données
- `pnpm db:migrate` - Créer une migration
- `pnpm db:studio` - Ouvrir Prisma Studio (interface de gestion de la BDD)

## 🎨 Personnalisation

### Modifier l'échelle de notes

Éditez `src/lib/config.ts` pour personnaliser les mentions :

```typescript
export const DEFAULT_GRADES = [
	'Excellent',
	'Très bien',
	// ... vos mentions personnalisées
];
```

## 📝 Utilisation

1. **Créer un sondage** : Accédez à la page d'accueil et remplissez le formulaire
2. **Voter** : Partagez le lien du sondage et évaluez chaque candidat
3. **Voir les résultats** : Consultez le classement calculé par jugement majoritaire

## 🔒 Sécurité des votes

L'application utilise une approche multi-couches pour prévenir les votes multiples :

- **Fingerprinting navigateur** : Canvas, WebGL, fonts, configuration système
- **localStorage** : Token persistant
- **Cookies HTTP** : Validation côté serveur
- **Hash SHA-256** : Protection de la vie privée

## 📄 Licence

Ce projet utilise le package `maju` pour le calcul du jugement majoritaire.
