import { useEffect, Suspense, useRef } from 'react'
import Scene3D from '../ThreeJS/Scene3D'
import About3D from '../ThreeJS/About3D'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { trackSectionView } from '../../utils/analytics'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver({ 
    threshold: 0.2,
    rootMargin: '200px',
    persist: true
  })
  const contentRef = useRef<HTMLDivElement>(null)
  const animationsCreatedRef = useRef(false)

  useEffect(() => {
    if (hasIntersected) {
      trackSectionView('about')
    }
  }, [hasIntersected])

  useEffect(() => {
    if (hasIntersected && contentRef.current && !animationsCreatedRef.current) {
      // Removida animação do contentRef - deve permanecer sem animação

      const elements = elementRef.current?.querySelectorAll('.animate-on-scroll') || []
      
      elements.forEach((el, index) => {
        gsap.set(el, { opacity: 0, y: 60, x: index % 2 === 0 ? -30 : 30 })
        gsap.to(el, {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.6,
          delay: 0.1 + index * 0.08,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      })

      const threeDElements = elementRef.current?.querySelectorAll('[class*="h-[600px]"], [class*="h-[700px]"], [class*="h-[800px]"], [class*="h-[900px]"], [class*="h-[1000px]"], [class*="h-[1100px]"]') || []
      threeDElements.forEach((el, index) => {
        gsap.set(el, { opacity: 0, scale: 0.85, rotationY: -20 })
        gsap.to(el, {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          delay: 0.15 + index * 0.08,
          ease: 'elastic.out(1, 0.6)',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
          },
        })

        // Efeito parallax 3D no scroll
        gsap.to(el, {
          y: -50,
          rotationY: 5,
          duration: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      })

      animationsCreatedRef.current = true
    }
  }, [hasIntersected, elementRef])

  const skills = [
    'Java',
    'Python',
    'C#',
    'TypeScript',
    'JavaScript',
    'HTML',
    'SCSS',
    'React',
    'React.js',
    'Three.js',
    'Node.js',
    'Spring',
    'Spring Boot',
    'Angular',
    'Bootstrap',
    '.NET',
    'GSAP',
    'Tailwind CSS',
    'Vite',
    'FastAPI',
    'Streamlit',
    'JPA/Hibernate',
    'ElectronJS',
    'PostgreSQL',
    'MongoDB',
    'Pandas',
    'Big Data',
    'Git',
    'GitHub',
    'Jira',
    'Selenium',
    'Playwright',
    'DBeaver',
    'Slack',
    'VS Code',
    'Docker',
    'Swagger',
  ]

  return (
    <section
      id="about"
      ref={elementRef}
      className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div ref={contentRef} className="space-y-8 relative z-10 md:pr-4">
            <div className="animate-on-scroll">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Sobre <span className="text-primary-400">Mim</span>
              </h2>
            </div>

            <div className="animate-on-scroll space-y-4 text-gray-300 text-base sm:text-lg">
              <p>
                Engenheiro de Software formado pela Fatesg (conclusão em 
                2025) com sólida trajetória de 3 anos e 8 meses na Escolar 
                Manager. Atuei como Analista de QA, desenvolvendo uma visão 
                crítica sobre o produto e garantindo entregas de alta qualidade que 
                resolvem problemas reais do usuário.
              </p>
              <p>
                Possuo competências em C#, React.js e automação, com inglês fluente 
                para atuação em times globais. Busco aplicar minha experiência em 
                engenharia para escalar processos de testes e otimizar os ciclos de 
                desenvolvimento.
              </p>
            </div>

            {/* Foto de Perfil */}
            <div className="animate-on-scroll">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-primary-500/30 shadow-lg shadow-primary-500/20 mx-auto md:mx-0">
                <img
                  src="/images/face.png"
                  alt="Pedro - Desenvolvedor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="animate-on-scroll">
              <h3 className="text-2xl font-bold text-white mb-4">
                Tecnologias
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Objeto 3D Decorativo */}
          <div className="relative h-[400px] sm:h-[500px] md:h-[800px] lg:h-[900px] xl:h-[1000px] animate-on-scroll overflow-hidden md:overflow-visible">
            <div className="absolute inset-0 w-full h-full pointer-events-auto" style={{ zIndex: 1 }}>
              <Suspense fallback={<div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">Carregando 3D...</div>}>
                <Scene3D
                  cameraPosition={[0, 0.3, 8.5]}
                  enableControls={true}
                  enableZoom={false}
                  className="w-full h-full"
                >
                  <About3D />
                </Scene3D>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
