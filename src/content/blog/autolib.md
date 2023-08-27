---
title: 'Autolib'
description: 'Projet fictif de réservation de voitures'
pubDate: 'Jun 8 2023'
heroImage: '/portfolio/autolib/autolib.png'
---
## Introduction

### Technologies

J'ai développé l'application en ASP.NET Core avec l'ORM Entity.
Pour la vue et le contrôleur, j'ai utilisé Blazor qui est une alternative à MVC et Razor Pages. C'est un framework
d'application (SPA) à une seule page qui se contente d'utiliser C# au lieu de JavaScript.

#### Authentification

Pour la partie d'authentification, j'ai utilisé la dépendance `Microsoft.AspNetCore.Identity.EntityFrameworkCore` qui
est
une partie du framework ASP.NET Core Identity. C'est une bibliothèque qui fournit une API pour l'authentification des
utilisateurs, y compris la fonctionnalité de vérification des mots de passe, le changement de mot de passe et
l'authentification à deux facteurs.

`ASP.NET Core Identity` utilise `Entity Framework Core` pour interagir avec la base de données. Ainsi, les informations
de
l'utilisateur sont stockées dans une base de données relationnelle qui peut être SQL Server, MySQL ou autre. La
bibliothèque Microsoft.AspNetCore.Identity.EntityFrameworkCore fournit également des tables prédéfinies pour gérer les
utilisateurs, les rôles, les revendications, etc.

## Fonctionnalités

### Quand l'utilisateur est connecté

Sur le site web, on retrouve une barre de navigation à gauche avec les liens des pages "Bornes", "Véhicules",
"Réservations", "Mes informations".

#### Visualisation des bornes

![img.png](/portfolio/autolib/portfolio/autolib.png)

#### Réservation de véhicules

La réservation de véhicule s'effectue à partir de la date du jour jusqu'à une date de fin que l'utilisateur doit choisir
![img_1.png](/portfolio/autolib/img_1.png)
Lorsque l'utilisateur clique sur "Réserver", une boite de dialogue s'affiche avec la date de fin à indiquer.
![img_6.png](/portfolio/autolib/img_6.png)

Une fois une véhicule réservé, une notification s'affiche en bas à droite du site en vert afin d'indiquer à
l'utilisateur
que le véhicule a bien été reservé.
![img_7.png](/portfolio/autolib/img_7.png)

#### Visualisation de ses réservations

![img_2.png](/portfolio/autolib/img_2.png)

#### Visualisation de ses informations personnelles

![img_3.png](/portfolio/autolib/img_3.png)

### Quand l'utilisateur n'est pas connecté

L'utilisateur a la possibilité de s'inscrire et de se désinscrire

#### Inscription

![img_4.png](/portfolio/autolib/img_4.png)

#### Connexion

![img_5.png](/portfolio/autolib/img_5.png)




