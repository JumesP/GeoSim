# 🌍 GeoSim

GeoSim is a real-time life simulation built with Next.js, React, TypeScript, Node.js and MapLibre.

The project simulates a small population of people living their everyday lives across the UK. Each person has a home, workplace, favourite locations and a set of behaviours that determine where they go throughout the day.

The long-term goal is to create a dynamic world where people work, sleep, travel, shop, exercise, visit friends and interact with their environment based on time, personality, preferences and needs.

A live, realtime simulation will soon be avaliable on my website: Jumes.me

> Imaging **a Find My like geographic simulation.**

<img width="1353" height="599" alt="Screenshot 2026-09-22 at 15 56 34" src="https://github.com/user-attachments/assets/575cbee1-e6f7-40cf-b3e7-bfd5ff387fb4" />

---

## ✨ Features

### 🗺️ Interactive Map

GeoSim uses **MapLibre GL** to visualise the simulated world.

- Real-world UK locations
- Custom person markers
- Profile pictures on markers
- Animated location indicators
- Selectable people
- Person-specific location filtering
- Smooth movement between locations

### 👤 Simulated People

Each person in the simulation has their own data and routine.

A person can have:

- Name
- Age
- Profile picture
- Home
- Workplace
- Favourite locations
- Regular locations
- Current location
- Current activity/status
- Movement speed

For example:

```text
John
├── 🏠 Home
├── 💼 Work
├── 🛒 Favourite Shop
├── 🍺 Favourite Pub
└── 🏋️ Gym
```

---

## 🧠 Behaviour Simulation

GeoSim isn't designed to simply move people between predefined locations.

The simulation is being designed around **weighted decision making**, allowing behaviour to emerge from multiple factors.

An activity can start with a base probability:

| Activity | Base Weight |
|---|---:|
| 🏠 Stay Home | 45 |
| 🛒 Shopping | 20 |
| 🍺 Pub | 20 |
| 🏋️ Exercise | 10 |
| 👥 Visit Friend | 5 |

These weights can then be modified by the person's:

- Personality
- Preferences
- Needs
- Tiredness
- Hunger
- Social needs
- Money
- Weather
- Day of the week
- Time of day
- Current circumstances

The simulation then makes **one weighted choice** from the resulting possibilities.

This approach allows two people living in the same area to behave very differently.

---

## 🚶 Movement

People can travel between locations using different movement modes.

Current movement types include:

- 🚶 Walking
- 🚲 Cycling
- 🚗 Driving-style movement

Movement speeds can also be modified on a per-person basis, allowing the simulation to represent different mobility requirements and preferences.

The simulation calculates a person's movement between geographic coordinates rather than instantly teleporting them between locations.

---

## 🕐 Simulation Time

GeoSim has its own simulation clock.

The world can run using real-world time, allowing routines such as:

```text
07:00  Wake up
08:00  Leave home
08:30  Arrive at work
12:00  Lunch
17:00  Leave work
17:30  Go shopping
19:00  Return home
23:00  Sleep
```

The simulation can also run at an accelerated speed, allowing an entire day to be observed much faster than real time.

The displayed time uses the **Europe/London** timezone.


---
<!--
## 🧱 Architecture

to be added

---
-->

## 🛠️ Tech Stack

### Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **MapLibre GL**

### Backend

- **Node.js**
- **Express**
- TypeScript

### Development

- **Git / GitHub**
- REST API

---
<!--
## 📁 Project Structure

TBD

---

## 🚀 Getting Started

---

## 🔌 API

---

## 🧑‍🤝‍🧑 Person Model

---

## 📍 World Locations

---
-->
## 🔮 Future Plans

GeoSim is currently and activily being developed

---
<!--
## 🎯 Project Goals

---
-->
## 📸 Screenshots

Screenshots and demonstrations will be added as the project develops.

---

## 📄 License

This project is currently intended as a personal development and portfolio project.

License information will be added as the project matures.

---

## 👨‍💻 Author

**James Price**

Computer Science graduate and Full Stack Developer interested in simulation, web applications, AI and interactive systems.

[GitHub](https://github.com/JumesP)

