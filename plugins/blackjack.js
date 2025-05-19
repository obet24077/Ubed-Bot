class Blackjack {
    decks;
    state = "waiting";
    player = [];
    dealer = [];
    table = {
        player: { total: 0, cards: [] },
        dealer: { total: 0, cards: [] },
        bet: 0,
        payout: 0,
        doubleDowned: false,
    };
    cards;
    endHandlers = [];

    constructor(decks) {
        this.decks = this.validateDeck(decks);
    }

    placeBet(bet) {
        if (!Number.isInteger(bet) || bet <= 0) {
            throw new Error("⚠️ Taruhan harus berupa angka positif lebih dari 0.");
        }
        if (bet > 1000000) {
            throw new Error("⚠️ Taruhan tidak boleh melebihi 1.000.000");
        }
        this.table.bet = bet;
    }

    start() {
        if (this.table.bet <= 0) {
            throw new Error("⚠️ Anda harus memasang taruhan sebelum bermain.");
        }
        this.cards = new Deck(this.decks);
        this.cards.shuffleDeck();
        this.player = this.cards.dealCard(2);
        let dealerFirstCard;
        do {
            dealerFirstCard = this.cards.dealCard(1)[0];
        } while (dealerFirstCard.value > 11);
        this.dealer = [dealerFirstCard, ...this.cards.dealCard(1)];
        this.updateTable();
        return this.table;
    }

    hit() {
        if (this.state === "waiting") {
            const newCard = this.cards.dealCard(1)[0];
            this.player.push(newCard);
            this.updateTable();
            const playerSum = sumCards(this.player);
            if (playerSum > 21) {
                this.state = "dealer_win";
                this.emitEndEvent();
            }
            return this.table;
        }
    }

    stand() {
        let dealerSum = sumCards(this.dealer);
        while (dealerSum < 17) {
            this.dealer.push(...this.cards.dealCard(1));
            dealerSum = sumCards(this.dealer);
            this.updateTable();
        }
        const playerSum = sumCards(this.player);
        if (dealerSum > 21 || dealerSum < playerSum) {
            this.state = "player_win";
        } else if (dealerSum > playerSum) {
            this.state = "dealer_win";
        } else {
            this.state = "draw";
        }
        this.emitEndEvent();
    }

    updateTable() {
        this.table.player = formatCards(this.player);
        this.table.dealer = formatCards(this.dealer);
    }

    emitEndEvent() {
        this.calculatePayout();
        for (let handler of this.endHandlers) {
            handler({
                state: this.state,
                player: formatCards(this.player),
                dealer: formatCards(this.dealer),
                bet: this.table.bet,
                payout: this.table.payout,
            });
        }
    }

    calculatePayout() {
        if (this.state === "player_win") {
            this.table.payout = this.table.bet * 2;
        } else if (this.state === "draw") {
            this.table.payout = this.table.bet;
        } else {
            this.table.payout = 0;
        }
    }

    validateDeck(decks) {
        if (!decks || decks < 1 || decks > 8) {
            throw new Error("⚠️ Jumlah deck harus antara 1-8.");
        }
        return decks;
    }

    onEnd(handler) {
        this.endHandlers.push(handler);
    }
}

class Deck {
    deck = [];
    constructor(decks) {
        for (let i = 0; i < decks; i++) {
            this.createDeck();
        }
    }

    createDeck() {
        const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        const suits = ["♣️", "♦️", "♠️", "♥️"];
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({
                    name: `${value} of ${suit}`,
                    suit,
                    value: value === "A" ? 11 : isNaN(value) ? 10 : parseInt(value),
                });
            }
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCard(num) {
        return this.deck.splice(0, num);
    }
}

function sumCards(cards) {
    let value = cards.reduce((acc, card) => acc + card.value, 0);
    let aces = cards.filter(card => card.value === 11).length;
    while (value > 21 && aces) {
        value -= 10;
        aces--;
    }
    return value;
}

function formatCards(cards) {
    return { total: sumCards(cards), cards: cards.map(card => card.name) };
}

const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });

const blackjackMessage = (usedPrefix, command, conn, m, blackjack) => {
    const { table, state } = blackjack;
    const { bet, dealer, player, payout } = table;
    const dealerCards = dealer.cards.join(', ');
    const playerCards = player.cards.join(', ');

    let message = `*🃏 BLACKJACK 🃏*\n\n`;
    message += `🎴 *Kartu Anda:* ${playerCards} (Total: ${player.total})\n`;
    message += `🎴 *Kartu Dealer:* ${dealer.cards.length > 1 ? dealerCards : `${dealer.cards[0]}, ❓`} (Total: ${state === "waiting" ? "?" : dealer.total})\n\n`;

    if (state === "player_win") {
        message += `🎉 *Anda Menang!* Payout: ${formatter.format(payout)}\n`;
    } else if (state === "dealer_win") {
        message += `😔 *Anda Kalah!* Payout: ${formatter.format(payout)}\n`;
    } else if (state === "draw") {
        message += `🤝 *Seri!* Taruhan dikembalikan: ${formatter.format(payout)}\n`;
    } else {
        message += `💰 *Taruhan:* ${formatter.format(bet)}\n\n`;
        message += `Ketik *${usedPrefix + command} hit* untuk menambah kartu.\n`;
        message += `Ketik *${usedPrefix + command} stand* untuk mengakhiri giliran.\n`;
        message += `Ketik *${usedPrefix + command} end* untuk keluar dari permainan.\n`;
    }

    return message;
};

const handler = async (m, { conn, usedPrefix, command, args }) => {
    conn.blackjack = conn.blackjack || {};
    let [aksi, argumen] = args;

    if (!aksi) {
        return conn.reply(m.chat, `*🃏 BLACKJACK GAME*\n\nContoh penggunaan:\n- *${usedPrefix + command} start <jumlah_taruhan>*\n- *${usedPrefix + command} hit*\n- *${usedPrefix + command} stand*\n- *${usedPrefix + command} end*\n\nTaruhan maksimal: 1.000.000`, m);
    }

    try {
        switch (aksi) {
            case 'start': {
                if (conn.blackjack[m.chat]) return conn.reply(m.chat, "🎮 Permainan Blackjack sudah dimulai!", m);
                let bet = parseInt(argumen);
                if (isNaN(bet) || bet <= 0) return conn.reply(m.chat, "⚠️ Masukkan taruhan yang valid!", m);
                if (bet > 1000000) return conn.reply(m.chat, "⚠️ Taruhan tidak boleh lebih dari 1.000.000!", m);
                let user = global.db.data.users[m.sender];
                if (user.money < bet) return conn.reply(m.chat, "💸 Uang kamu tidak cukup untuk taruhan!", m);

                conn.blackjack[m.chat] = new Blackjack(1);
                conn.blackjack[m.chat].idPemain = m.sender;
                conn.blackjack[m.chat].placeBet(bet);
                user.money -= bet;

                conn.blackjack[m.chat].onEnd(({ state, payout }) => {
                    if (state === "player_win") {
                        user.money += payout;
                    } else if (state === "draw") {
                        user.money += payout;
                    }
                    conn.reply(m.chat, blackjackMessage(usedPrefix, command, conn, m, conn.blackjack[m.chat]), m);
                    delete conn.blackjack[m.chat];
                });

                conn.blackjack[m.chat].start();
                return conn.reply(m.chat, blackjackMessage(usedPrefix, command, conn, m, conn.blackjack[m.chat]), m);
            }

            case 'hit':
                if (!conn.blackjack[m.chat]) return conn.reply(m.chat, "⚠️ Anda belum memulai permainan!", m);
                conn.blackjack[m.chat].hit();
                return conn.reply(m.chat, blackjackMessage(usedPrefix, command, conn, m, conn.blackjack[m.chat]), m);

            case 'stand':
                if (!conn.blackjack[m.chat]) return conn.reply(m.chat, "⚠️ Anda belum memulai permainan!", m);
                conn.blackjack[m.chat].stand();
                return; // Akan dijawab lewat onEnd

            case 'end':
                if (conn.blackjack[m.chat]) {
                    delete conn.blackjack[m.chat];
                    return conn.reply(m.chat, "🚪 Anda keluar dari permainan Blackjack!", m);
                } else {
                    return conn.reply(m.chat, "⚠️ Tidak ada permainan yang sedang berlangsung.", m);
                }

            default:
                return conn.reply(m.chat, `⚠️ Perintah tidak dikenali!\nGunakan: *${usedPrefix + command} help*`, m);
        }
    } catch (e) {
        return conn.reply(m.chat, `❌ Terjadi kesalahan: ${e.message}`, m);
    }
};

handler.command = /^blackjack$/i;
handler.tags = ['game'];
handler.help = ['blackjack'];
handler.limit = true;
handler.premium = false;

export default handler;