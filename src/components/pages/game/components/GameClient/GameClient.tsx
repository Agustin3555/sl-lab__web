import './GameClient.css'
import {
  type ChangeEventHandler,
  type FormEventHandler,
  useState,
  useEffect,
} from 'react'
import { Button } from '@/components'
import { InputField, Round } from './components'
import { GameSimulation, type RoundData } from '../../helpers'

enum NumberSet {
  PLAYERS = 'players',
  ELEMENTS_CARDS_IN_HAND = 'elementsCardsInHand',

  STAGE_CARDS = 'stageCards',
  DUO_STAGE_CARDS = 'duoStageCards',

  ELEMENT_CARDS = 'elementCards',
  TYPES_OF_ELEMENTS = 'typesOfElements',
  CARDS_BY_TYPES_OF_ELEMENTS = 'cardsByTypesOfElements',
  ELEMENT_CARDS_GIVEN_BY_A_PLAYER = 'elementCardsGivenByAPlayer',

  MAX_ROUNDS = 'maxRounds',
  AVERAGE_ROUNDS = 'averageRounds',
  MIN_ROUNDS = 'minRounds',
  VICTORY_POINTS = 'victoryPoints',
}

const INIT_NUMBER_INPUTS: Record<NumberSet, number> = {
  [NumberSet.PLAYERS]: 6,
  [NumberSet.ELEMENTS_CARDS_IN_HAND]: 8,

  [NumberSet.STAGE_CARDS]: 40,
  [NumberSet.DUO_STAGE_CARDS]: 5,
  [NumberSet.TYPES_OF_ELEMENTS]: 4,
  [NumberSet.CARDS_BY_TYPES_OF_ELEMENTS]: 5,

  [NumberSet.VICTORY_POINTS]: 3,
}

const GameClient = () => {
  const [numberInputs, setNumberInputsState] = useState(INIT_NUMBER_INPUTS)
  const [rounds, setRounds] = useState<RoundData[] | undefined>(undefined)

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    const game = new GameSimulation(
      numberInputs[NumberSet.PLAYERS],
      numberInputs[NumberSet.ELEMENTS_CARDS_IN_HAND],
      numberInputs[NumberSet.STAGE_CARDS],
      numberInputs[NumberSet.ELEMENT_CARDS_GIVEN_BY_A_PLAYER],
      numberInputs[NumberSet.VICTORY_POINTS]
    )

    game.play()

    setRounds(game.rounds)
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    const { id, value } = event.target
    setNumberInputsState(prev => ({ ...prev, [id]: Number(value) }))
  }

  useEffect(() => {
    setNumberInputsState(prev => ({
      ...prev,
      [NumberSet.ELEMENT_CARDS]:
        numberInputs[NumberSet.ELEMENT_CARDS_GIVEN_BY_A_PLAYER] *
        numberInputs[NumberSet.PLAYERS],
    }))
  }, [
    numberInputs[NumberSet.ELEMENT_CARDS_GIVEN_BY_A_PLAYER],
    numberInputs[NumberSet.PLAYERS],
  ])

  useEffect(() => {
    setNumberInputsState(prev => ({
      ...prev,
      [NumberSet.ELEMENT_CARDS_GIVEN_BY_A_PLAYER]:
        numberInputs[NumberSet.TYPES_OF_ELEMENTS] *
        numberInputs[NumberSet.CARDS_BY_TYPES_OF_ELEMENTS],
    }))
  }, [
    numberInputs[NumberSet.TYPES_OF_ELEMENTS],
    numberInputs[NumberSet.CARDS_BY_TYPES_OF_ELEMENTS],
  ])

  useEffect(() => {
    setNumberInputsState(prev => ({
      ...prev,
      [NumberSet.MAX_ROUNDS]:
        numberInputs[NumberSet.PLAYERS] *
          (numberInputs[NumberSet.VICTORY_POINTS] - 1) +
        1,
    }))
  }, [numberInputs[NumberSet.PLAYERS], numberInputs[NumberSet.VICTORY_POINTS]])

  useEffect(() => {
    setNumberInputsState(prev => ({
      ...prev,
      [NumberSet.AVERAGE_ROUNDS]: numberInputs[NumberSet.MAX_ROUNDS] / 2,
    }))
  }, [numberInputs[NumberSet.MAX_ROUNDS]])

  useEffect(() => {
    setNumberInputsState(prev => ({
      ...prev,
      [NumberSet.MIN_ROUNDS]: numberInputs[NumberSet.VICTORY_POINTS],
    }))
  }, [numberInputs[NumberSet.VICTORY_POINTS]])

  const fieldset: {
    title: string
    fields: {
      key: NumberSet | NumberSet | NumberSet
      title: string
      desc?: string
      use?: (NumberSet | NumberSet | NumberSet)[]
      max?: number
      min?: number
    }[]
  }[] = [
    {
      title: 'Jugadores',
      fields: [
        {
          key: NumberSet.PLAYERS,
          title: 'Jugadores',
          desc: 'Cantidad de jugadores',
          min: 3,
        },
        {
          key: NumberSet.ELEMENTS_CARDS_IN_HAND,
          title: 'Cartas en mano',
          desc: 'Cantidad de cartas de elementos en mano de cada jugador',
          min: 6,
        },
      ],
    },
    {
      title: 'Frases',
      fields: [
        {
          key: NumberSet.STAGE_CARDS,
          title: 'Cartas de frases',
          desc: 'Cantidad inicial de cartas del mazo de frases',
          min: numberInputs[NumberSet.MAX_ROUNDS],
        },
        {
          key: NumberSet.DUO_STAGE_CARDS,
          title: 'Cartas de frases doble',
          desc: 'Cantidad inicial de cartas en el mazo de frases con 2 casilleros a completar',
          max: numberInputs[NumberSet.STAGE_CARDS],
        },
      ],
    },
    {
      title: 'Elementos',
      fields: [
        {
          key: NumberSet.ELEMENT_CARDS,
          title: 'Cartas de elementos',
          desc: 'Cantidad inicial de cartas del mazo de elementos',
          use: [NumberSet.ELEMENT_CARDS_GIVEN_BY_A_PLAYER, NumberSet.PLAYERS],
          min:
            numberInputs[NumberSet.ELEMENTS_CARDS_IN_HAND] *
              numberInputs[NumberSet.PLAYERS] +
            (numberInputs[NumberSet.MAX_ROUNDS] - 1) *
              (numberInputs[NumberSet.PLAYERS] - 1),
        },
        {
          key: NumberSet.TYPES_OF_ELEMENTS,
          title: 'Tipos de elementos',
          desc: 'Cantidad de tipos de elementos',
          min: 4,
        },
        {
          key: NumberSet.CARDS_BY_TYPES_OF_ELEMENTS,
          title: 'Cartas por tipo de elemento',
          desc: 'Cantidad de cartas por tipo de elemento',
          min: 5,
        },
        {
          key: NumberSet.ELEMENT_CARDS_GIVEN_BY_A_PLAYER,
          title: 'Cartas de elementos que da 1 jugador',
          desc: 'Cartas de elementos que da 1 jugador...',
          use: [
            NumberSet.TYPES_OF_ELEMENTS,
            NumberSet.CARDS_BY_TYPES_OF_ELEMENTS,
          ],
        },
      ],
    },
    {
      title: 'Juego',
      fields: [
        {
          key: NumberSet.VICTORY_POINTS,
          title: 'Puntos de victoria',
          desc: 'Cantidad de puntos que un jugador debe conseguir para ganar',
        },
        {
          key: NumberSet.MAX_ROUNDS,
          title: 'Rondas máximas',
          desc: 'Cantidad de rondas...',
          use: [NumberSet.PLAYERS, NumberSet.VICTORY_POINTS],
        },
        {
          key: NumberSet.AVERAGE_ROUNDS,
          title: 'Media de rondas',
          desc: 'Media de rondas...',
          use: [NumberSet.MAX_ROUNDS],
          max: 10,
        },
        {
          key: NumberSet.MIN_ROUNDS,
          title: 'Rondas mínimas',
          desc: 'Cantidad de rondas...',
          use: [NumberSet.VICTORY_POINTS],
          min: 2,
        },
      ],
    },
  ]

  return (
    <div className="cmp-game-client">
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
      {rounds && (
        <article className="rounds">
          <ul>
            {rounds.map((item, index) => (
              <Round key={index} number={index + 1} {...item} />
            ))}
          </ul>
        </article>
      )}
      {/* {results && <Summary {...results.b} />} */}
    </div>
  )
}

export default GameClient
