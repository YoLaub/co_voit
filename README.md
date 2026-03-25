# Dossier d'Architecture Technique — Frontend Co'Voit

## Table des matières

1. [Présentation générale](#1-présentation-générale)
2. [Stack technique](#2-stack-technique)
3. [Structure du projet](#3-structure-du-projet)
4. [Architecture applicative](#4-architecture-applicative)
5. [Système de routage](#5-système-de-routage)
6. [Gestion de l'état](#6-gestion-de-létat)
7. [Couche API](#7-couche-api)
8. [Flux d'authentification](#8-flux-dauthentification)
9. [Gestion des données avec React Query](#9-gestion-des-données-avec-react-query)
10. [Composants réutilisables](#10-composants-réutilisables)
11. [Hooks personnalisés et utilitaires](#11-hooks-personnalisés-et-utilitaires)
12. [Design system et responsive](#12-design-system-et-responsive)
13. [Configuration et build](#13-configuration-et-build)
14. [Tests](#14-tests)
15. [Diagrammes de flux](#15-diagrammes-de-flux)

---

## 1. Présentation générale

**Co'Voit** est une application web de covoiturage permettant aux utilisateurs de publier des trajets, rechercher des trajets disponibles et réserver des places. L'application est construite comme une **Single Page Application (SPA)** avec une approche **mobile-first**.

Le frontend communique avec un backend Spring Boot via une API REST sécurisée par JWT (JSON Web Tokens) et s'intègre à l'API Adresse du gouvernement français pour l'autocomplétion des adresses.

### Périmètre fonctionnel du frontend

| Domaine | Fonctionnalités |
|---------|----------------|
| Authentification | Inscription, connexion, réinitialisation de mot de passe, suppression de compte |
| Profil | Complétion du profil, édition, consultation |
| Trajets | Publication (formulaire multi-étapes), consultation, recherche, suppression |
| Réservations | Réservation d'un trajet, annulation, consultation des réservations |
| Véhicules | Ajout, modification, suppression d'un véhicule |
| Messagerie | Envoi d'e-mails au conducteur ou aux passagers via modale |

---

## 2. Stack technique

### Dépendances principales

| Technologie | Version | Rôle |
|-------------|---------|------|
| **React** | 19.2.0 | Framework UI (composants fonctionnels + hooks) |
| **TypeScript** | 5.9.3 | Typage statique strict |
| **Vite** | 7.3.1 | Bundler et serveur de développement (HMR) |
| **Tailwind CSS** | 4.2.1 | Framework CSS utilitaire |
| **Zustand** | 5.0.11 | Gestion d'état légère (authentification) |
| **React Query** | 5.90.21 | Gestion des requêtes serveur (cache, invalidation) |
| **Axios** | 1.13.6 | Client HTTP |
| **React Router DOM** | 7.13.1 | Routage côté client |

### Dépendances de développement

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Vitest** | 4.1.0 | Tests unitaires et d'intégration |
| **Playwright** | 1.58.2 | Tests end-to-end |
| **Testing Library** | 16.3.2 | Utilitaires de test React |
| **MSW** | 2.12.13 | Mock des appels API en test |
| **ESLint** | 9.39.1 | Linting du code |

### Choix techniques justifiés

- **Vite** plutôt que Webpack : démarrage quasi instantané en dev grâce à l'ESM natif, build optimisé avec Rollup.
- **Zustand** plutôt que Redux : API minimale, pas de boilerplate, suffisant pour le seul besoin (auth).
- **React Query** plutôt que gestion manuelle : cache automatique, invalidation déclarative, gestion du loading/error intégrée.
- **Tailwind CSS v4** : importé via le plugin Vite (`@tailwindcss/vite`), pas de fichier `tailwind.config.js` nécessaire.

---

## 3. Structure du projet

```
src/
├── main.tsx                        # Point d'entrée — React root, providers
├── App.tsx                         # Conteneur de routes
├── index.css                       # Import Tailwind + variables CSS
│
├── api/                            # Couche d'accès aux données
│   ├── axiosClient.ts              # Instance Axios configurée + intercepteurs
│   ├── authApi.ts                  # Endpoints authentification
│   ├── profilApi.ts                # Endpoints profil utilisateur
│   ├── tripsApi.ts                 # Endpoints trajets
│   ├── reservationsApi.ts          # Endpoints réservations
│   └── carsApi.ts                  # Endpoints véhicules
│
├── store/                          # État global
│   └── authStore.ts                # Store Zustand (token + user)
│
├── hooks/                          # Hooks personnalisés
│   └── useAddressSearch.ts         # Autocomplétion adresse (debounce 300ms)
│
├── utils/                          # Fonctions utilitaires pures
│   ├── formatAddress.ts            # Transformation suggestion → DTO backend
│   └── distance.ts                 # Calcul de distance (formule de Haversine)
│
├── routes/                         # Configuration du routage
│   ├── AppRouter.tsx               # Définition de toutes les routes
│   └── ProtectedRoute.tsx          # Garde d'authentification
│
├── components/                     # Composants réutilisables
│   ├── ProfileCard.tsx             # Carte de profil utilisateur
│   ├── VehicleForm.tsx             # Formulaire véhicule (création/édition)
│   ├── layout/                     # Composants de mise en page
│   │   ├── Navbar.tsx              # Barre de navigation fixe (bottom)
│   │   ├── AppLayout.tsx           # Layout principal (Navbar + Outlet + Footer)
│   │   └── Footer.tsx              # Pied de page
│   └── ui/                         # Composants UI génériques
│       ├── Stepper.tsx             # Wizard multi-étapes
│       ├── AddressInput.tsx        # Input avec autocomplétion adresse
│       ├── RideCard.tsx            # Carte de trajet
│       └── EmailModal.tsx          # Modale de composition d'e-mail
│
├── pages/                          # Pages (une par route)
│   ├── Login.tsx                   # Connexion
│   ├── Register.tsx                # Inscription
│   ├── ForgotPassword.tsx          # Mot de passe oublié
│   ├── ResetPassword.tsx           # Réinitialisation mot de passe
│   ├── CompleteProfil.tsx          # Complétion du profil (première connexion)
│   ├── EditProfile.tsx             # Édition du profil
│   ├── Profile.tsx                 # Page profil + liens rapides
│   ├── Ride.tsx                    # Page d'accueil (flux de trajets)
│   ├── Search.tsx                  # Recherche de trajets
│   ├── CreateRide.tsx              # Création de trajet (4 étapes)
│   ├── RideDetails.tsx             # Détails d'un trajet
│   ├── MyRide.tsx                  # Mes trajets publiés (vue conducteur)
│   ├── MyReservations.tsx          # Mes réservations (vue passager)
│   └── Vehicle.tsx                 # Gestion du véhicule
│
└── __tests__/                      # Tests
    ├── setup.ts                    # Configuration Vitest
    ├── components/                 # Tests composants
    ├── pages/                      # Tests pages
    ├── mocks/                      # MSW handlers + server
    └── helpers/                    # Utilitaires de test
```

### Principes d'organisation

- **Séparation par responsabilité** : API, store, hooks, utils, composants, pages sont dans des dossiers dédiés.
- **Convention de nommage** :
  - Composants et pages : `PascalCase.tsx`
  - Hooks : `useXxx.ts`
  - Services API : `xxxApi.ts`
  - Utilitaires : `camelCase.ts`
- **Colocalisation** : les tests sont regroupés dans `__tests__/` avec une structure miroir de `src/`.

---

## 4. Architecture applicative

### Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                      Navigateur                         │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                   React 19 SPA                    │  │
│  │                                                   │  │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────────────┐  │  │
│  │  │  Pages  │──│Composants│──│   Hooks React    │  │  │
│  │  └────┬────┘  └──────────┘  └────────┬────────┘  │  │
│  │       │                              │            │  │
│  │  ┌────┴──────────────────────────────┴────────┐   │  │
│  │  │            React Query (cache)             │   │  │
│  │  └────────────────────┬───────────────────────┘   │  │
│  │                       │                           │  │
│  │  ┌────────────────────┴───────────────────────┐   │  │
│  │  │         Couche API (Axios + intercepteurs)  │   │  │
│  │  └────────────────────┬───────────────────────┘   │  │
│  │                       │                           │  │
│  │  ┌────────────────────┴───────────────────────┐   │  │
│  │  │     Zustand Store (auth + localStorage)    │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │ HTTPS (REST + JWT)
                           ▼
              ┌─────────────────────────┐
              │  Backend Spring Boot    │
              │  (API REST + JWT Auth)  │
              └─────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │  API Adresse Gouv.fr    │
              │  (autocomplétion)       │
              └─────────────────────────┘
```

### Couches applicatives

| Couche | Responsabilité | Fichiers |
|--------|---------------|----------|
| **Présentation** | Rendu UI, interactions utilisateur | `pages/`, `components/` |
| **Logique métier** | Hooks, transformations, calculs | `hooks/`, `utils/` |
| **Gestion d'état** | État global persisté (auth) | `store/authStore.ts` |
| **Cache serveur** | Cache des données API, invalidation | React Query (`useQuery`, `useMutation`) |
| **Accès données** | Communication HTTP avec le backend | `api/` (Axios) |

---

## 5. Système de routage

### Configuration

Le routage est géré par **React Router DOM v7** avec une configuration déclarative dans `AppRouter.tsx`.

### Table des routes

#### Routes publiques (accessibles sans authentification)

| Chemin | Composant | Description |
|--------|-----------|-------------|
| `/login` | `Login` | Page de connexion |
| `/register` | `Register` | Page d'inscription |
| `/forgot-password` | `ForgotPassword` | Demande de réinitialisation |
| `/reset-password` | `ResetPassword` | Réinitialisation avec token |

#### Routes protégées (nécessitent un token JWT valide)

| Chemin | Composant | Description |
|--------|-----------|-------------|
| `/` | `Ride` | Page d'accueil — flux de trajets |
| `/complete-profil` | `CompleteProfil` | Complétion du profil (1re connexion) |
| `/create-trip` | `CreateRide` | Création de trajet (wizard 4 étapes) |
| `/trips/:id` | `RideDetails` | Détails d'un trajet |
| `/search` | `Search` | Recherche de trajets |
| `/my-trips` | `MyRide` | Trajets publiés par l'utilisateur |
| `/my-reservations` | `MyReservations` | Réservations de l'utilisateur |
| `/profile` | `Profile` | Page profil |
| `/profile/edit` | `EditProfile` | Édition du profil |
| `/vehicle` | `Vehicle` | Gestion du véhicule |

### Mécanisme de protection des routes

```
Utilisateur → Accède à une route protégée
                    │
                    ▼
            ProtectedRoute
            ┌───────────────┐
            │ token existe ? │
            └───────┬───────┘
                    │
              ┌─────┴─────┐
              │           │
            Oui         Non
              │           │
              ▼           ▼
        Affiche la    Redirection
        page enfant   vers /login
```

`ProtectedRoute` est un composant wrapper qui :
1. Lit le `token` depuis le store Zustand.
2. Si le token est absent → redirige vers `/login`.
3. Si le token est présent → affiche les enfants (`<Outlet />`).

### Layout des routes protégées

Toutes les routes protégées sont englobées dans `AppLayout` qui fournit :
- La **Navbar** fixe en bas de l'écran (5 onglets de navigation).
- Le contenu principal via `<Outlet />` (React Router).
- Le **Footer** en bas de page.

---

## 6. Gestion de l'état

### Philosophie

L'application adopte une approche minimaliste de la gestion d'état :

- **Zustand** : uniquement pour l'authentification (token + user), persisté dans `localStorage`.
- **React Query** : gestion de tout l'état serveur (trajets, profils, véhicules, réservations).
- **État local React** (`useState`) : pour les formulaires et l'UI temporaire.

### Store Zustand — `authStore.ts`

#### Structure du state

```typescript
interface AuthUser {
  accountId: number
  email: string
  role: string
  hasCompletedProfile: boolean
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
  isAuthenticated: () => boolean
  updateUser: (patch: Partial<AuthUser>) => void
}
```

#### Persistance

Le store utilise le middleware `persist` de Zustand :
- **Clé de stockage** : `auth-storage`
- **Mécanisme** : `localStorage`
- **Données persistées** : `token` et `user`
- **Restauration** : automatique au chargement de l'application (réhydratation)

#### Accès au store

```typescript
// Dans un composant React (via hook) :
const token = useAuthStore((s) => s.token)
const user = useAuthStore((s) => s.user)

// Dans un service API (hors composant React) :
const token = useAuthStore.getState().token
```

---

## 7. Couche API

### Client HTTP centralisé — `axiosClient.ts`

L'application utilise une instance Axios configurée avec deux intercepteurs :

```
Requête sortante                     Réponse entrante
      │                                    │
      ▼                                    ▼
┌─────────────────┐               ┌─────────────────┐
│ Intercepteur    │               │ Intercepteur     │
│ Request         │               │ Response         │
│                 │               │                  │
│ • Lit token     │               │ • Si 401 :       │
│   depuis store  │               │   logout() +     │
│ • Injecte       │               │   redirect /login│
│   Authorization │               │                  │
│   Bearer header │               │ • Sinon :        │
└────────┬────────┘               │   passe la       │
         │                        │   réponse        │
         ▼                        └──────────────────┘
   Backend API
```

**URL de base** : `https://covoit-api.john-world.store` (surcharge possible via `VITE_API_URL`).

### Organisation des services API

Chaque module API exporte des **fonctions asynchrones pures** (pas de hooks React) :

| Module | Endpoints | Méthodes |
|--------|-----------|----------|
| `authApi.ts` | `/login`, `/register`, `/forgot-password`, `/reset-password`, `/api/persons/:id` | POST, DELETE |
| `profilApi.ts` | `/api/persons/:id`, `/api/persons/me`, `/api/persons` | GET, PATCH, POST |
| `tripsApi.ts` | `/api/trips`, `/api/trips/:id`, `/api/persons/me/trips-driver`, `/api/trips/:id/contact` | GET, POST, DELETE |
| `reservationsApi.ts` | `/api/trips/:id/person`, `/api/trips/my-reservations` | GET, POST, DELETE |
| `carsApi.ts` | `/api/brands`, `/api/models/brand/:id`, `/api/cars/my-car`, `/api/cars`, `/api/cars/:id` | GET, POST, PUT, DELETE |

### Types de données échangés

#### Profil

```typescript
interface ProfilResponse {
  profilId: number
  accountId: number
  firstname: string
  lastname: string
  phone: string
  status: string
  hasVehicle: boolean
  vehicle: {
    id: number
    brand: string
    model: string
    seats: number
    carregistration: string
  } | null
}
```

#### Trajet

```typescript
interface RouteResponse {
  id: number
  departure: string
  arrival: string
  date: string
  hour: string
  kms: number
  availableSeats: number
  driverName: string
  iconLabel: string
}

interface RouteDetailResponse extends RouteResponse {
  driver: PersonResponse
  vehicle: VehicleResponse | null
  passengers?: PersonResponse[]
}

interface CreateTripRequest {
  kms: number
  availableSeats: number
  tripDatetime: string
  startingAddress: AddressRequest
  arrivalAddress: AddressRequest
  iconId?: number
}
```

#### Réservation

```typescript
interface ReservationResponse {
  routeId: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
  departureCity: string
  arrivalCity: string
  tripDate: string
  driverName: string
}
```

#### Véhicule

```typescript
interface VehicleResponse {
  id: number
  brandName: string
  modelName: string
  seats: number
  carregistration: string
  additionalInfo?: string
}
```

---

## 8. Flux d'authentification

### Diagramme complet

```
┌──────────┐     POST /login        ┌──────────────┐
│  Login   │ ──────────────────────► │   Backend    │
│  Page    │                         │  Spring Boot │
│          │ ◄────────────────────── │              │
│          │   { token, accountId,   └──────────────┘
│          │     email, role }
└────┬─────┘
     │
     │  login(token, user)
     ▼
┌──────────────────────┐
│   Zustand Store      │
│   + localStorage     │
│   (auth-storage)     │
└────────┬─────────────┘
         │
         │  Vérification profil complet
         ▼
     ┌───────────────────┐
     │ hasCompletedProfile│
     │      == true ?     │
     └───────┬───────────┘
        Oui  │      Non
         │   │       │
         ▼   │       ▼
      Page / │  /complete-profil
             │
     ┌───────┴────────────────────────┐
     │  Toutes les requêtes suivantes │
     │  incluent automatiquement :    │
     │  Authorization: Bearer <token> │
     │  (via intercepteur Axios)      │
     └───────┬────────────────────────┘
             │
             │  Si réponse 401
             ▼
     ┌────────────────┐
     │  logout()      │
     │  • Clear store │
     │  • Clear LS    │
     │  • Redirect    │
     │    /login      │
     │  (full reload) │
     └────────────────┘
```

### Étapes détaillées

1. L'utilisateur saisit email/mot de passe sur `/login`.
2. `POST /login` envoie les identifiants au backend.
3. Le backend retourne un token JWT + les infos utilisateur.
4. `useAuthStore.login(token, user)` persiste le tout dans Zustand + `localStorage`.
5. L'app vérifie `hasCompletedProfile` :
   - **`true`** → redirection vers `/` (accueil).
   - **`false`** → redirection vers `/complete-profil`.
6. Chaque requête API ultérieure inclut automatiquement le header `Authorization: Bearer <token>` via l'intercepteur Axios.
7. En cas de réponse **401** (token expiré/invalide), l'intercepteur appelle `logout()` qui vide le store, efface le `localStorage` et force un rechargement complet vers `/login`.

### Sécurité

- Le token JWT est stocké dans `localStorage` (persistance entre sessions).
- Le logout effectue un `window.location.href = '/login'` (rechargement complet) pour garantir le nettoyage de tout état en mémoire.
- La suppression de compte (`DELETE /api/persons/:id`) déclenche également un logout complet.

---

## 9. Gestion des données avec React Query

### Fonctionnement

React Query (`@tanstack/react-query` v5) gère l'ensemble des données provenant du serveur :

```
Composant
    │
    ├── useQuery('trips')         → GET /api/trips → cache automatique
    │                                                  │
    │                                     ┌────────────┴──────────┐
    │                                     │ Cache React Query     │
    │                                     │ • Clé : ['trips']     │
    │                                     │ • Données en cache    │
    │                                     │ • Stale time          │
    │                                     │ • Refetch auto        │
    │                                     └───────────────────────┘
    │
    ├── useMutation(createTrip)   → POST /api/trips
    │       │
    │       └── onSuccess: invalidateQueries(['trips'])
    │                          │
    │                          └── → Refetch automatique des trajets
    │
    └── Rendu UI avec loading / error / data
```

### Pattern d'utilisation type

**Lecture (GET)** :
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['trips'],
  queryFn: getAllTrips
})
```

**Mutation (POST/PUT/DELETE)** :
```typescript
const mutation = useMutation({
  mutationFn: createTrip,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['trips'] })
    // Redirection ou toast de succès
  }
})
```

### Clés de cache utilisées

| Clé | Endpoint | Utilisé par |
|-----|----------|-------------|
| `['trips']` | `GET /api/trips` | Ride (accueil) |
| `['trip', id]` | `GET /api/trips/:id` | RideDetails |
| `['myTrips']` | `GET /api/persons/me/trips-driver` | MyRide |
| `['myReservations']` | `GET /api/trips/my-reservations` | MyReservations |
| `['passengers', id]` | `GET /api/trips/:id/person` | RideDetails |
| `['myProfil']` | `GET /api/persons/me` | EditProfile |
| `['profil', id]` | `GET /api/persons/:id` | RideDetails |
| `['myCar']` | `GET /api/cars/my-car` | Vehicle |
| `['brands']` | `GET /api/brands` | VehicleForm |
| `['models', brandId]` | `GET /api/models/brand/:id` | VehicleForm |
| `['search', params]` | `GET /api/trips?...` | Search |

### Invalidation après mutation

| Mutation | Clés invalidées |
|----------|----------------|
| Créer un trajet | `['trips']`, `['myTrips']` |
| Supprimer un trajet | `['trips']`, `['myTrips']` |
| Réserver un trajet | `['trip', id]`, `['myReservations']` |
| Annuler une réservation | `['trip', id]`, `['myReservations']` |
| Créer/modifier un véhicule | `['myCar']` |
| Supprimer un véhicule | `['myCar']` |

---

## 10. Composants réutilisables

### Composants de layout

#### `AppLayout`
Composant de mise en page englobant toutes les routes protégées.

```
┌─────────────────────────┐
│        Navbar           │  ← Navigation fixe (bottom)
├─────────────────────────┤
│                         │
│       <Outlet />        │  ← Contenu de la page active
│                         │
├─────────────────────────┤
│        Footer           │  ← Logo + copyright
└─────────────────────────┘
```

#### `Navbar`
Barre de navigation fixe en bas de l'écran avec 5 onglets :

| Icône | Route | Libellé |
|-------|-------|---------|
| Maison | `/` | Accueil |
| Loupe | `/search` | Recherche |
| Voiture | `/my-trips` | Mes trajets |
| Calendrier | `/my-reservations` | Mes réservations |
| Utilisateur | `/profile` | Profil |

L'onglet actif est mis en surbrillance avec la couleur `#1A365D`.

### Composants UI

#### `Stepper` — Wizard multi-étapes

Composant contrôlé pour les formulaires en plusieurs étapes.

**Props** :
| Prop | Type | Description |
|------|------|-------------|
| `steps` | `string[]` | Labels des étapes |
| `currentStep` | `number` | Étape active (0-indexé) |
| `onNext` | `() => void` | Passer à l'étape suivante |
| `onPrev` | `() => void` | Revenir à l'étape précédente |
| `onSubmit` | `() => void` | Soumission finale |
| `children` | `ReactNode` | Contenu de l'étape active |

**Comportement visuel** :
- Indicateurs d'étape avec checkmarks pour les étapes complétées.
- Lignes de connexion entre les étapes.
- Boutons Précédent/Suivant (désactivés selon l'étape).
- Bouton Soumettre sur la dernière étape.

Utilisé dans `CreateRide.tsx` pour la création de trajet en 4 étapes :
1. Adresse de départ
2. Adresse d'arrivée
3. Date, heure, places disponibles
4. Récapitulatif

#### `AddressInput` — Autocomplétion d'adresse

Champ de saisie avec suggestions d'adresse en temps réel.

**Fonctionnement** :
1. L'utilisateur tape une adresse (minimum 3 caractères).
2. Après 300ms de debounce, `useAddressSearch` interroge l'API Adresse Gouv.
3. Les suggestions s'affichent dans une liste déroulante.
4. Au clic sur une suggestion, `onSelect` retourne l'objet complet.
5. La liste se ferme au clic extérieur.

#### `RideCard` — Carte de trajet

Affiche les informations d'un trajet dans un format carte cliquable :
- Itinéraire (départ → arrivée + km)
- Date et heure (format `fr-FR`)
- Nom du conducteur
- Badge de places disponibles (vert si dispo, rouge si complet)
- Lien vers `/trips/:id`

#### `EmailModal` — Modale de messagerie

Modale de composition d'e-mail avec éditeur riche :
- Champ objet
- Zone de texte avec `contentEditable`
- Barre d'outils : Gras, Italique, Souligné, Liste
- Envoi via `POST /api/trips/:id/contact`

#### `VehicleForm` — Formulaire véhicule

Formulaire réutilisable pour la création et l'édition d'un véhicule :
- Sélection de marque (chargé via `GET /api/brands`)
- Sélection de modèle (conditionnel à la marque)
- Nombre de places (1-9)
- Immatriculation (validation regex : `AB-123-CD`)

#### `ProfileCard` — Carte de profil

Affiche les informations d'un utilisateur :
- Avatar avec initiales (fond bleu foncé)
- Nom complet et e-mail
- Numéro de téléphone
- Badge "Conducteur" si `hasVehicle === true`

---

## 11. Hooks personnalisés et utilitaires

### `useAddressSearch` — Hook d'autocomplétion

```typescript
interface AddressSuggestion {
  label: string
  city: string
  postcode: string
  street: string
  housenumber: string
  lat: number
  lon: number
}

function useAddressSearch(): {
  suggestions: AddressSuggestion[]
  loading: boolean
  searchAddress: (query: string) => void
  clear: () => void
}
```

**Caractéristiques** :
- **Debounce** : 300ms pour limiter les appels.
- **Seuil minimal** : 3 caractères avant de déclencher la recherche.
- **API externe** : `https://api-adresse.data.gouv.fr/search/`.
- **Limite** : 5 résultats maximum par requête.

### `formatAddress.ts` — Transformation d'adresse

```typescript
function toAddressRequest(suggestion: AddressSuggestion): AddressRequest
```

Convertit une suggestion de l'API Adresse Gouv en DTO compatible avec le backend :

| Champ source (Gouv) | Champ cible (Backend) |
|----------------------|-----------------------|
| `housenumber` | `streetNumber` |
| `label` | `streetName` |
| `postcode` | `postalCode` |
| `city` | `city` |
| `lat` | `latitude` |
| `lon` | `longitude` |

### `distance.ts` — Calcul de distance

```typescript
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number
```

Calcule la distance en kilomètres entre deux coordonnées GPS en utilisant la **formule de Haversine**. Le résultat est arrondi à l'entier le plus proche. Utilisé dans `CreateRide.tsx` pour estimer la distance du trajet.

---

## 12. Design system et responsive

### Palette de couleurs

| Couleur | Code | Utilisation |
|---------|------|-------------|
| Bleu foncé | `#1A365D` | Headers, boutons primaires, onglets actifs, avatars |
| Orange | `#E97A2B` | Call-to-action, accents, états de succès |
| Gris fond | `#F3F4F6` | Arrière-plans de page |
| Gris bordure | `gray-200` / `gray-300` | Bordures, séparateurs |
| Gris texte | `gray-600` à `gray-800` | Texte courant |

### Typographie

- **Famille** : `system-ui, Avenir, Helvetica, Arial, sans-serif`
- **Hauteur de ligne** : 1.5
- **Rendu** : `antialiased` (via CSS dans `index.css`)

### Approche responsive

L'application suit une approche **mobile-first** via Tailwind CSS :

- Design par défaut optimisé pour mobile.
- Adaptations desktop via les breakpoints Tailwind (`sm:`, `md:`).
- Conteneurs avec largeur maximale (`max-w-md`, `max-w-2xl`) pour le confort de lecture sur grand écran.
- Navbar fixe en bas sur mobile (pattern natif familier).
- Coins arrondis : `rounded-lg`, `rounded-xl`, `rounded-2xl`.

### Tailwind CSS v4

Tailwind est intégré via le **plugin Vite** (`@tailwindcss/vite`), ce qui signifie :
- Pas de fichier `tailwind.config.js`.
- Import dans `src/index.css` via `@import "tailwindcss"`.
- Détection automatique des classes dans les fichiers source.
- Pas de CSS custom — tout le styling est fait avec les classes utilitaires Tailwind.

---

## 13. Configuration et build

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `VITE_API_URL` | URL de base de l'API backend | `https://covoit-api.john-world.store` |

Accès dans le code via `import.meta.env.VITE_API_URL`.

### Scripts npm

| Commande | Action |
|----------|--------|
| `npm run dev` | Serveur de développement Vite (port 5173, HMR) |
| `npm run build` | Compilation TypeScript (`tsc -b`) + build Vite (production) |
| `npm run lint` | Vérification ESLint |
| `npm run preview` | Prévisualisation du build de production |
| `npm run test` | Tests unitaires (Vitest) |
| `npm run test:watch` | Tests en mode watch |
| `npm run test:coverage` | Couverture de tests |
| `npm run test:e2e` | Tests end-to-end (Playwright) |

### Configuration TypeScript

Deux configurations distinctes :

| Fichier | Cible | Scope |
|---------|-------|-------|
| `tsconfig.app.json` | ES2022 | Code source (`src/`) |
| `tsconfig.node.json` | ES2023 | Outils de build (`vite.config.ts`) |

Options strictes activées : `strict`, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`.

### Configuration ESLint

- Extends : `@eslint/js` recommandé + `typescript-eslint` recommandé.
- Plugins : `react-hooks`, `react-refresh`.
- Scope : `**/*.{ts,tsx}`.
- Override E2E : `rules-of-hooks` désactivé pour les tests Playwright.

### Build de production

Le build Vite génère :
- Des bundles JavaScript minifiés et tree-shakés.
- Du code-splitting automatique.
- Des assets optimisés dans le dossier `dist/`.

---

## 14. Tests

### Infrastructure de test

| Outil | Rôle | Configuration |
|-------|------|---------------|
| **Vitest** | Runner de tests unitaires/intégration | `vite.config.ts` (section `test`) |
| **Testing Library** | Utilitaires de rendu et d'interaction | `@testing-library/react` + `user-event` |
| **jsdom** | Environnement DOM simulé | Défini dans la config Vitest |
| **MSW** | Mock des appels API | Handlers dans `__tests__/mocks/` |
| **Playwright** | Tests end-to-end | `playwright.config.ts` |

### Organisation des tests

```
src/__tests__/
├── setup.ts                        # Initialisation Vitest
├── helpers/
│   └── renderWithProviders.tsx      # Rendu avec QueryClient + Router + Store
├── mocks/
│   ├── handlers.ts                  # Définition des handlers MSW
│   └── server.ts                    # Configuration du serveur MSW
├── components/
│   └── EmailModal.test.tsx          # Tests du composant EmailModal
└── pages/
    └── RideDetails.test.tsx         # Tests de la page RideDetails
```

### Stratégie de test

- **Tests unitaires** : composants UI isolés (Vitest + Testing Library).
- **Tests d'intégration** : pages complètes avec providers (QueryClient, Router, Store) via `renderWithProviders`.
- **Mocks API** : MSW intercepte les requêtes réseau et retourne des réponses contrôlées.
- **Tests E2E** : Playwright simule des parcours utilisateur complets dans un navigateur réel.

---

## 15. Diagrammes de flux

### Flux de création d'un trajet

```
Utilisateur connecté
        │
        ▼
  Clic "+ Publier"
        │
        ▼
  ┌─────────────────┐    Non    ┌──────────────────┐
  │ A un véhicule ? │ ────────► │ Redirect /vehicle │
  └────────┬────────┘           └──────────────────┘
           │ Oui
           ▼
  ┌─────────────────┐
  │ Étape 1 :       │
  │ Adresse départ  │ ← AddressInput + useAddressSearch
  │ (autocomplétion)│     → API Adresse Gouv (debounce 300ms)
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ Étape 2 :       │
  │ Adresse arrivée │ ← AddressInput + useAddressSearch
  │ (autocomplétion)│
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ Étape 3 :       │
  │ Date, heure,    │ ← Calcul distance via haversineKm()
  │ places dispo    │
  └────────┬────────┘
           ▼
  ┌─────────────────┐
  │ Étape 4 :       │
  │ Récapitulatif   │ ← Résumé avant soumission
  └────────┬────────┘
           │ Soumettre
           ▼
     POST /api/trips
           │
           ▼
  invalidateQueries(['trips', 'myTrips'])
           │
           ▼
  Redirect /my-trips
```

### Flux de réservation d'un trajet

```
Page RideDetails (/trips/:id)
        │
        ├── GET /api/trips/:id         → Détails du trajet
        ├── GET /api/trips/:id/person  → Liste des passagers
        │
        ▼
  ┌───────────────────────────┐
  │ Conditions pour réserver : │
  │ • N'est pas le conducteur  │
  │ • N'a pas déjà réservé     │
  │ • Places disponibles > 0   │
  └────────────┬──────────────┘
               │
               ▼
        Clic "Réserver"
               │
               ▼
     POST /api/trips/:id/person
               │
               ▼
   invalidateQueries(['trip', id], ['myReservations'])
               │
               ▼
       Toast de confirmation
```

### Flux de gestion du véhicule

```
Page /vehicle
        │
        ├── GET /api/cars/my-car
        │
        ▼
  ┌──────────────────┐
  │ Véhicule existe ? │
  └────────┬─────────┘
      Oui  │     Non
       │   │      │
       ▼   │      ▼
  Affichage │  VehicleForm
  détails   │  (mode création)
  + Edit    │      │
  + Delete  │      ├── GET /api/brands
       │    │      ├── GET /api/models/brand/:id
       │    │      │
       │    │      ▼
       │    │  POST /api/cars
       │    │
       ▼    │
  VehicleForm│
  (mode édit)│
       │     │
       ▼     │
  PUT /api/cars/:id
```

---

## Annexe — Points d'entrée du système

### `src/main.tsx` — Arbre des providers

```
<React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />           ← contient <AppRouter />
    </BrowserRouter>
  </QueryClientProvider>
</React.StrictMode>
```

### Communications externes

| Service | URL | Usage |
|---------|-----|-------|
| Backend Spring Boot | `https://covoit-api.john-world.store` | API REST (auth, CRUD, recherche) |
| API Adresse Gouv | `https://api-adresse.data.gouv.fr/search/` | Autocomplétion des adresses françaises |
