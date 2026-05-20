// React Three Fiber global JSX type augmentation for Next.js
// R3F extends JSX.IntrinsicElements in three-types.d.ts but
// Next.js's react-jsx transform may not pick it up automatically.
// This file forces the augmentation to be visible project-wide.

import "@react-three/fiber";
