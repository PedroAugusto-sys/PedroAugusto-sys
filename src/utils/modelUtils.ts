import * as THREE from 'three'

export const preserveMaterials = (object: THREE.Object3D) => {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.SkinnedMesh) {
      if (child.material) {
        const cloneMaterial = (mat: THREE.Material): THREE.Material => {
          const clonedMat = mat.clone()
          
          // Preservar todas as texturas do material original
          if (clonedMat instanceof THREE.MeshStandardMaterial || 
              clonedMat instanceof THREE.MeshPhongMaterial || 
              clonedMat instanceof THREE.MeshLambertMaterial ||
              clonedMat instanceof THREE.MeshPhysicalMaterial) {
            
            // Lista completa de propriedades de textura
            const textureProps = [
              'map', 'normalMap', 'roughnessMap', 'metalnessMap', 
              'emissiveMap', 'aoMap', 'lightMap', 'bumpMap', 
              'displacementMap', 'alphaMap', 'envMap'
            ]
            
            textureProps.forEach((prop) => {
              const texture = (mat as any)[prop] as THREE.Texture | undefined
              if (texture) {
                // Reutilizar a textura original (não clonar)
                (clonedMat as any)[prop] = texture
                if (texture.image) {
                  texture.needsUpdate = true
                }
              }
            })
            
            clonedMat.needsUpdate = true
          }
          
          return clonedMat
        }
        
        if (Array.isArray(child.material)) {
          child.material = child.material.map(cloneMaterial)
        } else {
          child.material = cloneMaterial(child.material)
        }
      }
    }
  })
}