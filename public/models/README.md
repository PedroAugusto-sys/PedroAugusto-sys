# Modelos 3D

Esta pasta contém os modelos 3D utilizados no portfólio.

## Formato Recomendado

- **GLB** (preferencial) - Formato binário, menor tamanho
- **GLTF** - Formato JSON, mais flexível

## Estrutura Sugerida

```
models/
├── hero/
│   ├── avatar.glb
│   ├── laptop.glb
│   └── holographic-cube.glb
├── about/
│   ├── react-logo.glb
│   ├── brain.glb
│   └── gears.glb
├── projects/
│   ├── smartphone.glb
│   ├── server.glb
│   └── code-cube.glb
└── achievements/
    ├── trophy.glb
    └── certificate.glb
```

## Como Usar

```typescript
import { useGLTF } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/models/hero/avatar.glb')
  return <primitive object={scene} />
}
```

## Otimização

- Tamanho máximo recomendado: < 2MB por modelo
- Polígonos: < 10k triângulos
- Texturas: 512x512 ou 1024x1024 (máximo)
- Use compressão Draco quando possível

## Fontes Recomendadas

- [Sketchfab](https://sketchfab.com)
- [Poly Haven](https://polyhaven.com)
- [TurboSquid](https://turbosquid.com)
- [Free3D](https://free3d.com)
