import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Code2, Database, Layers3, ShieldCheck } from 'lucide-react'

const coreSkills = [
  'SAP ERP FI/CO/TR/HR 모듈 세팅, 운영 및 ABAP 개발',
  'e-HR 개발 및 관리, B2BERP/영림원 ERP 개발 및 관리',
  'ABAP, Java, C#, Mybuilder, Oracle, MS-SQL 기반 업무 시스템 개발',
]

const capabilityGroups = [
  {
    icon: Layers3,
    title: 'SAP ERP 운영',
    text: 'FI를 중심으로 CO, TR, HR까지 회계/자금/인사 업무 흐름을 함께 보고 운영합니다.',
  },
  {
    icon: Code2,
    title: '개발과 운영의 결합',
    text: 'ABAP과 외부 시스템 개발 경험을 바탕으로 현업 요구를 시스템 변경까지 연결합니다.',
  },
  {
    icon: Database,
    title: '데이터와 인터페이스',
    text: 'Oracle, MS-SQL, e-HR, 관리 시스템 연계를 포함한 업무 데이터 흐름을 다룹니다.',
  },
]

const careerItems = [
  {
    company: '인크루트키컴ERP',
    period: '2007.06 ~ 2010.07',
    duration: '3년 2개월',
    role: '개발1팀 주임 2년차',
    summary: 'B2BERP 인사급여회계 모듈 담당으로 세법 변경, 연말정산, 표준화 업무를 수행했습니다.',
    tasks: ['인사/급여/회계 모듈 운영 및 개발', '변경 세법 적용', '연말정산 수행 및 표준화'],
  },
  {
    company: '경동원',
    period: '2010.11 ~ 재직중',
    duration: '15년 9개월',
    role: '경영정보팀 과장 3년차',
    summary: '경동나비엔 외 국내 5개 법인과 해외 3개 법인의 SAP ERP 및 e-HR, 관리 시스템을 설계, 개발, 운영했습니다.',
    tasks: ['SAP ERP FI/CO/TR/HR 운영', 'e-HR 및 기타 관리 시스템 설계/개발/관리', '국내외 법인 업무 프로세스 대응'],
  },
  {
    company: '에프앤에프',
    period: '2021.11 ~ 2023.09',
    duration: '1년 11개월',
    role: '차장/파트장 14년차',
    summary: 'F&F, F&CO, F&F 상해법인의 SAP ERP FI/CO 운영과 롤아웃, 버전 업그레이드 프로젝트를 수행했습니다.',
    tasks: [
      'F&F, F&CO, F&F 상해법인 SAP ERP FI/CO 운영',
      '중국법인 SAP 롤아웃 프로젝트 수행',
      'F&CO 버전 업그레이드 프로젝트 수행',
      'F&F 엔터테인먼트, F&F 로지스틱스 신규 법인 롤아웃 수행',
    ],
  },
  {
    company: '삼성바이오에피스',
    period: '2023.09 ~ 재직중',
    duration: '2년 11개월',
    role: 'DT 부장/팀원 14년차',
    summary: 'SAP FI/CO와 웹전표처리 시스템을 운영하고 신규 법인 설립, 개인정보 암호화, SWIFT 구축 업무를 수행했습니다.',
    tasks: [
      'SAP FI/CO 운영 및 웹전표처리(myFinance) 운영',
      '홀딩스, 넥스랩 법인 설립 Roll-out 프로젝트 수행(with SDS)',
      '개인정보 암호화 SAP 및 SWIFT 구축',
    ],
  },
]

export default function CareerPage() {
  return (
    <main className="career-page">
      <div className="about-page-top">
        <a className="back-link" href="/">
          <ArrowLeft size={15} aria-hidden="true" />
          Home
        </a>
      </div>

      <section className="career-hero">
        <p className="eyebrow">SAP ERP Career</p>
        <h1>
          SAP ERP FI를 중심으로
          <span>18년 동안 업무와 시스템 사이를 운영해왔습니다.</span>
        </h1>
        <p>
          여러 회사에서 SAP ERP FI/CO/TR/HR, e-HR, B2BERP, 영림원 ERP와 주변 관리 시스템을 운영하고 개발했습니다.
          회계 업무를 이해하는 운영자이면서, 필요한 변경을 직접 구현하는 개발자로 일해왔습니다.
        </p>
      </section>

      <section className="career-skill-panel" aria-label="Core capabilities">
        <div>
          <ShieldCheck size={22} aria-hidden="true" />
          <h2>핵심역량</h2>
        </div>
        <ul>
          {coreSkills.map((skill) => (
            <li key={skill}>
              <CheckCircle2 size={16} aria-hidden="true" />
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className="career-capability-grid" aria-label="Career capability summary">
        {capabilityGroups.map((item) => {
          const Icon = item.icon
          return (
            <article key={item.title}>
              <Icon size={22} aria-hidden="true" />
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          )
        })}
      </section>

      <section className="career-timeline" aria-label="Career timeline">
        <div className="section-title-row">
          <h2>주요 경력</h2>
          <p>SAP ERP 운영, 롤아웃, 법인 구축, 회계/인사/자금 시스템 운영 경험을 회사별로 정리했습니다.</p>
        </div>

        <div className="career-list">
          {careerItems.map((item) => (
            <article className="career-card" key={`${item.company}-${item.period}`}>
              <div className="career-card-meta">
                <BriefcaseBusiness size={18} aria-hidden="true" />
                <span>{item.period}</span>
                <small>{item.duration}</small>
              </div>
              <div className="career-card-body">
                <h3>{item.company}</h3>
                <strong>{item.role}</strong>
                <p>{item.summary}</p>
                <ul>
                  {item.tasks.map((task) => (
                    <li key={task}>{task}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
