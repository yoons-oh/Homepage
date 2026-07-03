import { ArrowLeft, ArrowUpRight, Layers3, Rocket, Sparkles, Workflow } from 'lucide-react'

const notes = [
  {
    icon: Rocket,
    title: '빠르게 만들고 실제로 올립니다',
    text: '아이디어를 말로만 오래 붙잡아두지 않습니다. 필요한 링크, 아이콘, 배포 주소를 바로 모으고 실제 페이지에 붙여 확인합니다.',
  },
  {
    icon: Sparkles,
    title: '좋아 보이는 것에 꽤 예민합니다',
    text: '대충 예쁘다는 말보다 화면 안에서 균형이 맞는지, 이미지 크기가 어색하지 않은지 끝까지 봅니다. 좋은 의미로 눈이 까다롭습니다.',
  },
  {
    icon: Workflow,
    title: 'AI를 도구가 아니라 작업 방식으로 씁니다',
    text: '완성된 결과를 기다리는 사람이 아니라, AI와 계속 주고받으며 수정하고 판단하고 방향을 좁혀가는 사람입니다.',
  },
]

export default function AboutPage() {
  return (
    <main className="about-page">
      <div className="about-page-top">
        <a className="back-link" href="/">
          <ArrowLeft size={15} aria-hidden="true" />
          Home
        </a>
        <a className="primary-link" href="/#work">
          작업물 보기
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>

      <section className="about-essay">
        <p className="eyebrow">About Yoon</p>
        <h1>
          함께 작업하며 본 Yoon은,
          <span>아이디어를 실제 화면으로 밀어붙이는 사람입니다.</span>
        </h1>

        <div className="essay-body">
          <p>
            Yoon을 소개한다면, 먼저 “빠르게 만드는 사람”이라고 말하고 싶습니다. 단순히 속도만 빠른 것이 아니라,
            만들고 싶은 것을 실제 링크와 화면으로 확인해야 마음이 놓이는 타입에 가깝습니다. 아이디어가 생기면
            설명에서 멈추지 않고, 앱을 만들고, 배포하고, 다시 보고, 어색하면 바로 고칩니다.
          </p>
          <p>
            같이 작업하면서 가장 선명하게 느낀 점은 기준이 있다는 것입니다. 카드 하나의 아이콘 크기, 이미지 비율,
            버튼이 가리키는 링크처럼 작아 보이는 부분도 그냥 넘기지 않습니다. “이렇게 보면 안 예쁘다”라고 말할 수
            있는 사람은 화면을 실제 사용자처럼 보고 있다는 뜻입니다.
          </p>
          <p>
            그는 AI를 신기한 도구로만 쓰지 않습니다. 필요한 것을 더 빨리 실험하고, 부족한 부분을 더 빨리 드러내고,
            자신의 판단으로 다시 다듬는 작업 방식으로 씁니다. 그래서 이 홈페이지는 단순한 포트폴리오라기보다,
            지금 만들고 있는 것들을 계속 시험하고 갱신하는 개인 작업실에 가깝습니다.
          </p>
        </div>
      </section>

      <section className="about-notes" aria-label="Working impressions">
        {notes.map((note) => {
          const Icon = note.icon
          return (
            <article className="about-note" key={note.title}>
              <Icon size={22} aria-hidden="true" />
              <h2>{note.title}</h2>
              <p>{note.text}</p>
            </article>
          )
        })}
      </section>

      <section className="about-close">
        <Layers3 size={20} aria-hidden="true" />
        <p>
          한 문장으로 줄이면, Yoon은 “생각한 것을 실제로 움직이는 화면까지 가져가는 사람”입니다.
          그리고 그 과정에서 디테일을 그냥 지나치지 않습니다.
        </p>
      </section>
    </main>
  )
}
