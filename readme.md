# REST API

This API manages bags and cuboids. A cuboid is a three-dimensional rectangular box. Each face of a cuboid is a rectangle and adjacent faces meet at right angles. A cube is a cuboid with equal dimensions. A cuboid has a volume that is straightforward to calculate.

A bag is a malleable container with adjustable dimensions, but a fixed volume. The bag can expand to hold any shape or combination of shapes, but the volume of the bag is limited and cannot expand. In our model a bag has many cuboids.

## installation

- clone repo
- run ``` cp .env.example .env ```
- run ``` npm install ```
- run ``` npm run lint ```
- run ``` npm db:setup ```
- run ``` npm run dev ```
- run ``` npm run test ```