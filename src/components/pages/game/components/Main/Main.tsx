import './Main.css'
import {
  type ChangeEventHandler,
  type FormEventHandler,
  useState,
  useEffect,
} from 'react'
import { Button } from '@/components'
import { InputField } from './components'
// import {
//   ChosenCards,
//   PlayerCard,
//   PlayerStatePerRound,
//   Round,
//   StageCard,
//   Report,
//   Results,
//   ResultsProps,
//   ReportItems,
// } from './components'
// import { randomInt, shuffleArray } from '../../helpers'

enum PlayersSet {
  PLAYERS = 'players',
  ELEMENTS_CARDS_IN_HAND = 'elementsCardsInHand',
}

enum CardsSet {
  STAGE_CARDS = 'stageCards',
  DUO_STAGE_CARDS = 'duoStageCards',
  ELEMENT_CARDS = 'elementCards',
  TYPES_OF_ELEMENTS = 'typesOfElements',
  CARDS_BY_TYPES_OF_ELEMENTS = 'cardsByTypesOfElements',
  ELEMENT_CARDS_GIVEN_BY_A_PLAYER = 'elementCardsGivenByAPlayer',
}

enum GameSet {
  MAX_ROUNDS = 'maxRounds',
  AVERAGE_ROUNDS = 'averageRounds',
  MIN_ROUNDS = 'minRounds',
  VICTORY_POINTS = 'victoryPoints',
}

const INIT_NUMBER_INPUTS: Record<PlayersSet | CardsSet | GameSet, number> = {
  [PlayersSet.PLAYERS]: 6,
  [PlayersSet.ELEMENTS_CARDS_IN_HAND]: 8,

  [CardsSet.STAGE_CARDS]: 40,
  [CardsSet.DUO_STAGE_CARDS]: 5,
  [CardsSet.TYPES_OF_ELEMENTS]: 4,
  [CardsSet.CARDS_BY_TYPES_OF_ELEMENTS]: 5,

  [GameSet.VICTORY_POINTS]: 3,
}

enum GameFinishedBy {
  MAX_SCORE_ACHIEVED,
  INSUFFICIENT_PLAYERS_CARDS,
  LIMIT_OF_ROUNDS,
}

const GAME_FINISHED: Record<GameFinishedBy, string> = {
  [GameFinishedBy.MAX_SCORE_ACHIEVED]:
    'Un jugador consiguió los puntos de victoria',
  [GameFinishedBy.INSUFFICIENT_PLAYERS_CARDS]:
    'Insuficientes cartas en mazo de elementos',
  [GameFinishedBy.LIMIT_OF_ROUNDS]: 'Se alcanzó el límite de rondas',
}

export default function App() {
  const [numberInputs, setNumberInputsState] = useState(INIT_NUMBER_INPUTS)
  // const [results, setResults] = useState<ResultsProps | undefined>(undefined)

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    const { id, value } = event.target
    setNumberInputsState(prev => ({ ...prev, [id]: Number(value) }))
  }

  useEffect(() => {
    setNumberInputsState(prev => ({
      ...prev,
      [CardsSet.ELEMENT_CARDS]:
        numberInputs[CardsSet.ELEMENT_CARDS_GIVEN_BY_A_PLAYER] *
        numberInputs[PlayersSet.PLAYERS],
    }))
  }, [
    numberInputs[CardsSet.ELEMENT_CARDS_GIVEN_BY_A_PLAYER],
    numberInputs[PlayersSet.PLAYERS],
  ])

  useEffect(() => {
    setNumberInputsState(prev => ({
      ...prev,
      [CardsSet.ELEMENT_CARDS_GIVEN_BY_A_PLAYER]:
        numberInputs[CardsSet.TYPES_OF_ELEMENTS] *
        numberInputs[CardsSet.CARDS_BY_TYPES_OF_ELEMENTS],
    }))
  }, [
    numberInputs[CardsSet.TYPES_OF_ELEMENTS],
    numberInputs[CardsSet.CARDS_BY_TYPES_OF_ELEMENTS],
  ])

  useEffect(() => {
    setNumberInputsState(prev => ({
      ...prev,
      [GameSet.MAX_ROUNDS]:
        numberInputs[PlayersSet.PLAYERS] *
          (numberInputs[GameSet.VICTORY_POINTS] - 1) +
        1,
    }))
  }, [numberInputs[PlayersSet.PLAYERS], numberInputs[GameSet.VICTORY_POINTS]])

  useEffect(() => {
    setNumberInputsState(prev => ({
      ...prev,
      [GameSet.AVERAGE_ROUNDS]: numberInputs[GameSet.MAX_ROUNDS] / 2,
    }))
  }, [numberInputs[GameSet.MAX_ROUNDS]])

  useEffect(() => {
    setNumberInputsState(prev => ({
      ...prev,
      [GameSet.MIN_ROUNDS]: numberInputs[GameSet.VICTORY_POINTS],
    }))
  }, [numberInputs[GameSet.VICTORY_POINTS]])

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()
  }

  const fieldset: {
    title: string
    fields: {
      key: PlayersSet | CardsSet | GameSet
      title: string
      desc?: string
      use?: (PlayersSet | CardsSet | GameSet)[]
      max?: number
      min?: number
    }[]
  }[] = [
    {
      title: 'Jugadores',
      fields: [
        {
          key: PlayersSet.PLAYERS,
          title: 'Jugadores',
          desc: 'Cantidad de jugadores',
          min: 3,
        },
        {
          key: PlayersSet.ELEMENTS_CARDS_IN_HAND,
          title: 'Cartas en mano',
          desc: 'Cantidad de cartas de elementos en mano de cada jugador',
          min: 6,
        },
      ],
    },
    {
      title: 'Cartas',
      fields: [
        {
          key: CardsSet.STAGE_CARDS,
          title: 'Cartas de frases',
          desc: 'Cantidad inicial de cartas del mazo de frases',
          min: numberInputs[GameSet.MAX_ROUNDS],
        },
        {
          key: CardsSet.DUO_STAGE_CARDS,
          title: 'Cartas de frases doble',
          desc: 'Cantidad inicial de cartas en el mazo de frases con 2 casilleros a completar',
          max: numberInputs[CardsSet.STAGE_CARDS],
        },
        {
          key: CardsSet.ELEMENT_CARDS,
          title: 'Cartas de elementos',
          desc: 'Cantidad inicial de cartas del mazo de elementos',
          use: [CardsSet.ELEMENT_CARDS_GIVEN_BY_A_PLAYER, PlayersSet.PLAYERS],
          min:
            numberInputs[PlayersSet.ELEMENTS_CARDS_IN_HAND] *
              numberInputs[PlayersSet.PLAYERS] +
            (numberInputs[GameSet.MAX_ROUNDS] - 1) *
              (numberInputs[PlayersSet.PLAYERS] - 1),
        },
        {
          key: CardsSet.TYPES_OF_ELEMENTS,
          title: 'Tipos de elementos',
          desc: 'Cantidad de tipos de elementos',
          min: 4,
        },
        {
          key: CardsSet.CARDS_BY_TYPES_OF_ELEMENTS,
          title: 'Cartas por tipo de elemento',
          desc: 'Cantidad de cartas por tipo de elemento',
          min: 5,
        },
        {
          key: CardsSet.ELEMENT_CARDS_GIVEN_BY_A_PLAYER,
          title: 'Cartas de elementos que da 1 jugador',
          desc: 'Cartas de elementos que da 1 jugador...',
          use: [
            CardsSet.TYPES_OF_ELEMENTS,
            CardsSet.CARDS_BY_TYPES_OF_ELEMENTS,
          ],
        },
      ],
    },
    {
      title: 'Juego',
      fields: [
        {
          key: GameSet.VICTORY_POINTS,
          title: 'Puntos de victoria',
          desc: 'Cantidad de puntos que un jugador debe conseguir para ganar',
        },
        {
          key: GameSet.MAX_ROUNDS,
          title: 'Rondas máximas',
          desc: 'Cantidad de rondas...',
          use: [PlayersSet.PLAYERS, GameSet.VICTORY_POINTS],
        },
        {
          key: GameSet.AVERAGE_ROUNDS,
          title: 'Media de rondas',
          desc: 'Media de rondas...',
          use: [GameSet.MAX_ROUNDS],
          max: 10,
        },
        {
          key: GameSet.MIN_ROUNDS,
          title: 'Rondas mínimas',
          desc: 'Cantidad de rondas...',
          use: [GameSet.VICTORY_POINTS],
          min: 2,
        },
      ],
    },
  ]

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="params">
          {fieldset.map(({ title, fields }) => (
            <fieldset key={title}>
              <legend>{title}</legend>
              {fields.map(({ key, title, min, max, use }) => (
                <InputField
                  key={key}
                  {...{
                    id: key,
                    title,
                    value: numberInputs[key],
                    min,
                    max,
                    readonly: use !== undefined,
                  }}
                  handleChange={handleChange}
                />
              ))}
            </fieldset>
          ))}
        </div>
        <Button text="Simular" faIcon="fa-solid fa-dice" />
      </form>
      {/* {results && results.a.map(item => <Round {...item} />)}
      {results && <Summary {...results.b} />} */}
    </>
  )
}
