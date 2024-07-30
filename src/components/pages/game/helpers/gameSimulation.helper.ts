import { randomInt, shuffle } from '.'

interface Card {
  id: number
}

interface PhraseCard extends Card {
  isDouble?: boolean
}

interface ElementCard extends Card {
  player: number
}

interface ElementsChosenByPlayer {
  player: number
  elementA: ElementCard
  elementB?: ElementCard
}

interface PlayerStatus {
  points: number
  cardsInHand: ElementCard[]
}

export interface RoundData {
  phraseCard: PhraseCard
  elementsChosenByPlayers: ElementsChosenByPlayer[]
  winningElementIndex: number
  playersStatusCapture: PlayerStatus[]
}

export class GameSimulation {
  deckOfPhrases!: PhraseCard[]
  deckOfElements!: ElementCard[]
  rounds: RoundData[] = []

  private players!: number
  private victoryPoints!: number
  private playerJudge!: number
  private playersStatus!: PlayerStatus[]

  constructor(
    players: number,
    elementsCardsInHand: number,
    phrases: number,
    elementsPerPlayer: number,
    victoryPoints: number
  ) {
    this.players = players
    this.victoryPoints = victoryPoints

    // Crear y mezclar el mazo de frases

    this.deckOfPhrases = Array.from<{}, PhraseCard>(
      { length: phrases },
      (_, index) => ({
        id: index,
      })
    )

    shuffle(this.deckOfPhrases)

    // Crear y mezclar el mazo de elementos

    this.deckOfElements = []

    for (let i = 0; i < players; i++)
      for (let j = 0; j < elementsPerPlayer; j++)
        this.deckOfElements.push({ id: j, player: i })

    shuffle(this.deckOfElements)

    // Primer reparto de cartas a los jugadores

    this.playersStatus = Array.from({ length: players }, () => ({
      points: 0,
      cardsInHand: Array.from(
        { length: elementsCardsInHand },
        () => this.deckOfElements.shift() as ElementCard
      ),
    }))

    // Determinación aleatoria del primer juez
    this.playerJudge = randomInt({ max: players - 1 })
  }

  play() {
    // Jugar hasta que algún jugador llegue a los puntos de victoria necesarios para ganar
    while (
      this.playersStatus.findIndex(
        ({ points }) => points === this.victoryPoints
      ) === -1
    ) {
      // Saca la primer carta del mazo de frases
      const phraseCard = this.deckOfPhrases.shift() as PhraseCard

      const elementsChosenByPlayers: ElementsChosenByPlayer[] = []

      this.playersStatus.forEach(({ cardsInHand: elements }, player) => {
        // Saltea al juez
        if (player === this.playerJudge) return

        // Carta elegida por el jugador según el criterio
        const chosenCardIndex = randomInt({ max: elements.length - 1 })
        const chosenCard = elements[chosenCardIndex]

        // Acumula la carta elegida con las demás
        elementsChosenByPlayers.push({ player, elementA: { ...chosenCard } })
      })

      // Carta elegida por el juez
      const winningElementIndex = randomInt({
        max: elementsChosenByPlayers.length - 1,
      })

      // Aumentamos un punto al jugador ganador
      const winningPlayer = elementsChosenByPlayers[winningElementIndex].player
      this.playersStatus[winningPlayer].points++

      // Guardar estado actual
      const playersStatusCapture = structuredClone(this.playersStatus)

      // Reponer cartas a los jugadores
      elementsChosenByPlayers.forEach(({ player, elementA }) => {
        const indexCardToBeReplaced = this.playersStatus[
          player
        ].cardsInHand.findIndex(
          ({ id, player }) => id === elementA.id && player === elementA.player
        )

        // Reemplazar la carta usada por una nueva
        this.playersStatus[player].cardsInHand[indexCardToBeReplaced] =
          this.deckOfElements.shift() as ElementCard
      })

      this.rounds.push({
        phraseCard,
        elementsChosenByPlayers,
        winningElementIndex,
        playersStatusCapture,
      })

      // Controlar el pase de rol de juez a través de las rondas
      this.playerJudge + 1 < this.players
        ? this.playerJudge++
        : (this.playerJudge = 0)
    }
  }
}
