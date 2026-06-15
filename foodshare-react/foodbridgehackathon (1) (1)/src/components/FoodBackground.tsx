/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';

interface FloatingItem {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

const FOOD_EMOJIS = ['🍎', '🥦', '🥑', '🍞', '🥣', '📦', '💖', '🥕', '🍲', '🍉', '🥗', '🏢', '🌾'];

export default function FoodBackground() {
  return (
    <div className="absolute inset-0 top-0 left-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      <div className="bg-food-pattern"></div>
      {/* Dynamic digital background lines */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/5 opacity-10 pointer-events-none"></div>
    </div>
  );
}
