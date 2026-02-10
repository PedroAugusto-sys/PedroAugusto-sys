import { useEffect, Suspense, useRef, useState } from 'react'
import Scene3D from '../ThreeJS/Scene3D'
import Achievements3D from '../ThreeJS/Achievements3D'
import { useGSAP } from '../../hooks/useGSAP'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { trackSectionView } from '../../utils/analytics'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Achievements = () => {
  const { elementRef, hasIntersected } = useIntersectionObserver({ 
    threshold: 0.2,
    rootMargin: '200px', // Pré-carregar quando estiver a 200px da viewport
    persist: true // Manter estado após primeira interseção
  })
  const { animateIn } = useGSAP()
  const animationsCreatedRef = useRef(false)
  const statsRefs = useRef<(HTMLDivElement | null)[]>([])
  const [displayValues, setDisplayValues] = useState<number[]>([0, 0, 0])

  useEffect(() => {
    if (hasIntersected) {
      trackSectionView('achievements')
    }
  }, [hasIntersected])

  useEffect(() => {
    if (hasIntersected && elementRef.current && !animationsCreatedRef.current) {
      const titleSection = elementRef.current.querySelector('h2')?.parentElement
      if (titleSection) {
        gsap.set(titleSection, { opacity: 0, y: 30 })
        gsap.to(titleSection, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleSection,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      }

      const statsData = [
        { label: 'Projetos Completos', value: '10+' },
        { label: 'Tecnologias Dominadas', value: '15+' },
        { label: 'Anos de Experiência', value: '3+' },
      ]
      
      const setupStatsAnimation = () => {
        const validStatsRefs = statsRefs.current.filter(ref => ref !== null)
        
        if (validStatsRefs.length !== statsData.length) {
          setTimeout(setupStatsAnimation, 50)
          return
        }
        
        statsRefs.current.forEach((statElement, index) => {
          if (!statElement || !statsData[index]) return
          
          gsap.set(statElement, { opacity: 0, y: 30, scale: 0.9 })
          
          const targetValue = statsData[index].value
          const numValue = parseInt(targetValue.replace(/\D/g, ''))
          
          gsap.to(statElement, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            delay: 0.05 + index * 0.05,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: statElement,
              start: 'top 90%',
              toggleActions: 'play none none none',
              once: true,
              onEnter: () => {
                const obj = { value: 0 }
                gsap.to(obj, {
                  value: numValue,
                  duration: 2,
                  ease: 'power2.out',
                  onUpdate: () => {
                    setDisplayValues((prev) => {
                      const newValues = [...prev]
                      newValues[index] = Math.floor(obj.value)
                      return newValues
                    })
                  }
                })
              }
            },
          })
        })
      }
      
      setupStatsAnimation()

      const elements = elementRef.current.querySelectorAll('.animate-on-scroll')
      elements.forEach((el, index) => {
        gsap.set(el, { opacity: 0, x: -30 })
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 0.4,
          delay: 0.1 + index * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      })

      const threeDElement = elementRef.current.querySelector('[class*="h-64"], [class*="h-96"]')
      if (threeDElement) {
        gsap.set(threeDElement, { opacity: 0, scale: 0.9 })
        gsap.to(threeDElement, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: threeDElement,
            start: 'top 90%',
            toggleActions: 'play none none none',
            once: true,
          },
        })
      }

      animationsCreatedRef.current = true
    }
  }, [hasIntersected, animateIn, elementRef])

  const achievements = [
    {
      id: 1,
      title: 'Bacharel em Engenharia de Software',
      description: 'Uma jornada transformadora que me preparou para criar soluções tecnológicas inovadoras. Durante toda a formação, desenvolvi habilidades técnicas sólidas em desenvolvimento de software, arquitetura de sistemas e gestão de projetos. Aprendi a transformar ideias em código, resolver problemas complexos e trabalhar em equipe para entregar produtos de alta qualidade. Esta formação não foi apenas sobre aprender tecnologias, mas sobre desenvolver uma mentalidade de engenharia que me permite enfrentar qualquer desafio com confiança e criatividade.',
      year: '2025',
    },
    {
      id: 2,
      title: 'Promoção para Analista QA Sênior',
      description: 'Promoção para Analista QA Sênior na Escolar Manager, assumindo responsabilidades estratégicas em projetos de automação e desenvolvimento de aplicações úteis para diversos setores da empresa. Este marco representa não apenas um reconhecimento do meu trabalho e dedicação, mas também uma oportunidade de impactar positivamente a qualidade dos produtos e processos organizacionais. A cada desafio superado, fortaleço minha paixão por criar soluções que fazem a diferença e demonstro que o crescimento profissional vem através da excelência, inovação e comprometimento constante.',
      year: '2023',
    },
    {
      id: 3,
      title: 'Início da Carreira',
      description: 'Início da jornada profissional como Suporte Técnico Nível 3, onde tive a oportunidade de desenvolver habilidades fundamentais que moldaram minha trajetória. Nesta posição, aprendi a criar scripts em SQL para otimizar processos e resolver problemas complexos, desenvolvi excelência no atendimento ao cliente com foco em soluções eficientes, e compreendi a importância de cada interação para o sucesso do negócio. Este foi o momento em que descobri minha paixão por tecnologia e aprendi que cada desafio é uma oportunidade de crescimento. O início pode ser humilde, mas é onde plantamos as sementes da excelência que nos levam a conquistas maiores.',
      year: '2022',
    },
  ]

  const stats = [
    { label: 'Projetos Completos', value: '10+' },
    { label: 'Tecnologias Dominadas', value: '15+' },
    { label: 'Anos de Experiência', value: '3+' },
  ]

  return (
    <section
      id="achievements"
      ref={elementRef}
      className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Conquistas e <span className="text-primary-400">Feitos</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg">
            Alguns dos meus principais marcos e realizações
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            {stats.map((stat, index) => (
              <div
                key={index}
                ref={(el) => {
                  statsRefs.current[index] = el
                }}
                className="bg-gray-900 rounded-lg p-6 text-center animate-on-scroll 
                           transition-all duration-300 ease-out
                           hover:scale-105 hover:bg-gray-800 hover:shadow-lg hover:shadow-primary-500/20
                           cursor-pointer group"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-400 mb-2
                              transition-all duration-300 
                              group-hover:text-primary-300 group-hover:scale-110">
                  {displayValues[index]}{stat.value.replace(/\d+/g, '')}
                </div>
                <div className="text-gray-400 text-sm md:text-base
                              transition-colors duration-300 
                              group-hover:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline de Conquistas */}
        <div className="space-y-8 mb-16">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="flex gap-6 animate-on-scroll
                       group cursor-pointer
                       transition-all duration-300 ease-out
                       hover:translate-x-2"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold
                              transition-all duration-300 ease-out
                              group-hover:scale-110 group-hover:bg-primary-400 group-hover:shadow-lg group-hover:shadow-primary-500/50">
                  {index + 1}
                </div>
                {index < achievements.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-700 mx-auto mt-2
                                transition-colors duration-300
                                group-hover:bg-primary-500/50" />
                )}
              </div>
              <div className="flex-1 pb-8 p-4 rounded-lg
                            transition-all duration-300 ease-out
                            hover:bg-gray-900/50 hover:shadow-lg">
                <div className="text-primary-400 text-sm mb-1
                              transition-all duration-300
                              group-hover:text-primary-300 group-hover:font-semibold">
                  {achievement.year}
                </div>
                <h3 className="text-xl font-bold text-white mb-2
                             transition-all duration-300
                             group-hover:text-primary-400 group-hover:scale-105 transform origin-left">
                  {achievement.title}
                </h3>
                <p className="text-gray-400
                            transition-colors duration-300
                            group-hover:text-gray-300">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Objeto 3D Decorativo */}
        <div className="h-64 md:h-96 animate-on-scroll">
          <Suspense fallback={<div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">Carregando 3D...</div>}>
            <Scene3D
              cameraPosition={[0, 0, 5]}
              enableControls={true}
              enableZoom={false}
              className="w-full h-full"
            >
              <Achievements3D />
            </Scene3D>
          </Suspense>
        </div>
      </div>
    </section>
  )
}

export default Achievements
