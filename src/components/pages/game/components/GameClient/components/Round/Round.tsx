import './Round.css'
import { Icon, Separator } from '@/components'
import { classList } from '@/helpers'
import { type RoundData } from '../../../../helpers'

interface Props extends RoundData {
  number: number
}

const Round = ({
  number,
  phraseCard,
  elementsChosenByPlayers,
  winningElementIndex,
  playersStatusCapture,
}: Props) => (
  <li className="cmp-round">
    <header>
      <h3>
        Ronda <strong>{number}</strong>
      </h3>
      <Separator />
    </header>
    <div className="content">
      <div className="chosen-cards">
        <div className="card card--stage">
          <p>{phraseCard.id}</p>
        </div>
        <ul className="deck">
          {elementsChosenByPlayers.map(({ player, elementA }, index) => (
            <li key={String(elementA.id) + String(elementA.player)}>
              <div
                className={classList('card', 'card--chosen-by-player', {
                  'card--chosen-by-judge': winningElementIndex === index,
                })}
              >
                <p>{elementA.id}</p>
                <small>P{elementA.player + 1}</small>
              </div>
              <footer>P{player + 1}</footer>
            </li>
          ))}
        </ul>
      </div>
      <ul className="players-status">
        {playersStatusCapture.map(({ points, cardsInHand }, player) => (
          <li key={player}>
            <ul
              className={classList('player-info', {
                'player-info--winner':
                  elementsChosenByPlayers[winningElementIndex].player ===
                  player,
              })}
            >
              {[
                { faIcon: 'fa-solid fa-user-circle', value: `P${player + 1}` },
                { faIcon: 'fa-solid fa-star', value: points },
              ].map(({ faIcon, value }, index) => (
                <li key={index}>
                  <Icon faIcon={faIcon} />
                  <p>{value}</p>
                </li>
              ))}
            </ul>
            <ul className="deck">
              {cardsInHand.map(({ id, player }) => (
                <li
                  key={String(id) + String(player)}
                  className={classList('card', {
                    'card--chosen-by-player':
                      elementsChosenByPlayers.findIndex(
                        ({ elementA }) =>
                          elementA.id === id && elementA.player === player
                      ) !== -1,
                  })}
                >
                  <p>{id}</p>
                  <small>P{player + 1}</small>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  </li>
)

export default Round
