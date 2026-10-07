const hueName = (h) => {
  if (h < 15 || h >= 345) return 'rusty red';
  if (h < 45)  return 'earthy brown';
  if (h < 70)  return 'golden ochre';
  if (h < 150) return 'moss green';
  if (h < 190) return 'teal';
  if (h < 250) return 'slate blue';
  if (h < 290) return 'dusky violet';
  return 'muted magenta';
};

function atmosphere(env, aquatic) {
  if (aquatic) {
    return env.light < 25
      ? 'deep dark ocean, faint bioluminescent glow, floating particles'
      : 'underwater god rays, shimmering light shafts, clear blue water';
  }
  if (env.humidity > 70) return 'misty forest morning, soft diffused fog, dewy air';
  if (env.humidity < 25 && env.temperature > 65) return 'harsh desert sun, heat haze, dusty air';
  if (env.temperature < 25) return 'cold snowy landscape, overcast sky, breath vapor';
  if (env.light < 25) return 'dim twilight, moody atmosphere';
  return 'golden hour sunlight, natural habitat';
}

export function buildPrompt(t, env) {
  const aquatic = t.aquatic > 50;
  const flying = !aquatic && t.wingSpan > 55;
  const p = [];

  p.push('A highly detailed, hyper-realistic National Geographic wildlife photography of an undiscovered animal species.');

  const tone = env.humidity > 60 ? 'dark, richly pigmented skin'
             : env.humidity < 40 ? 'pale, sun-bleached skin' : 'medium-toned skin';
  p.push(`Its body is ${hueName(t.hue)} with ${tone}.`);

  if (aquatic) {
    p.push('A marine creature with a streamlined body and powerful flippers.');
    if (env.waterExpanse > 70)
      p.push('Vast open ocean, massive highly hydrodynamic body built for long-distance cruising.');
    if (t.tailLength > 60) p.push('A large muscular tail fluke.');
  } else if (flying) {
    p.push('A flying creature soaring high, with large wings.');
  } else {
    p.push('A terrestrial animal.');
    if (env.gravity > 65) p.push('Thick, short, sturdy limbs.');
    else if (env.gravity < 35) p.push('Tall, delicate, elongated skeletal structure.');
  }

  if (t.neckLength > 60) p.push('Notably long neck.');
  if (t.eyeSize > 60)    p.push('Huge, prominent eyes adapted for low light.');
  if (t.earSize > 60)    p.push('Enormous ears for heat dissipation.');
  if (t.camouflage > 60) p.push('Natural camouflage patterns.');
  if (t.dietHardness > 70) p.push('Strong, thick beak or jaw for crushing hard food.');
  else if (t.dietHardness < 30) p.push('Slender, straight snout.');
  if (t.bioluminescence > 30) p.push('Glowing bioluminescent markings.');
  if (t.bodySize > 75) p.push('Enormous size.');
  else if (t.bodySize < 25) p.push('Small and agile.');

  p.push(atmosphere(env, aquatic));
  p.push('Cinematic lighting, 8k resolution, photorealistic, highly detailed texture, shot on 35mm lens, depth of field.');
  return p.join(' ');
}