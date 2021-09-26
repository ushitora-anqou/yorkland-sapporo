// Actorの初期位置の候補
const ACTOR_INIT_POS_CAND = [
  13,
  26,
  29,
  34,
  50,
  53,
  91,
  94,
  103,
  112,
  117,
  132,
  138,
  141,
  155,
  174,
  197,
  198,
];

// チケットの種類
enum Ticket {
  TAXI,
  BUS,
  UG,
  BLACK,
}

function ticket2str(ticket: Ticket): string {
  switch (ticket) {
    case Ticket.TAXI:
      return 'タクシー';
    case Ticket.BUS:
      return 'バス';
    case Ticket.UG:
      return '地下鉄';
    case Ticket.BLACK:
      return 'ブラックチケット';
    default:
      throw new Error('不正なチケットです');
  }
}

// 刑事とMr.Xを表す。ボード上のピン。
class Actor {
  private _pos: number; // 現在位置。ボード上の番号。
  private _numTickets: { [key in Ticket]: number }; // 各チケットの枚数。
  private _numDoubleMove: number; // ダブルムーブカードの枚数。
  private _isMrX: boolean; // Mr.Xならtrue。そうでなければfalse。

  constructor(initPos: number /* 初期位置 */, isMrX: boolean) {
    this._pos = initPos;
    this._isMrX = isMrX;
    if (isMrX) {
      this._numTickets = {
        [Ticket.TAXI]: 4,
        [Ticket.BUS]: 3,
        [Ticket.UG]: 3,
        [Ticket.BLACK]: 5,
      };
      this._numDoubleMove = 2;
    } else {
      this._numTickets = {
        [Ticket.TAXI]: 10,
        [Ticket.BUS]: 8,
        [Ticket.UG]: 4,
        [Ticket.BLACK]: 0,
      };
      this._numDoubleMove = 0;
    }
  }

  // ゲッターs
  get pos() {
    return this._pos;
  }
  get isMrX() {
    return this._isMrX;
  }
  get numDoubleMove() {
    return this._numDoubleMove;
  }

  // チケットの枚数を返却する。
  numTickets(ticket: Ticket) {
    return this._numTickets[ticket];
  }

  // チケットを1枚増やす。
  addOneTicket(ticket: Ticket) {
    return this._numTickets[ticket]++;
  }

  // dstにticketで移動可能かを返却する。移動可能なのは
  // 1. ticketが余っている、かつ
  // 2. そのticketで使用できる移動手段がthis._pos -> dstの経路を提供する
  private canMoveBy(ticket: Ticket, dst: number): boolean {
    if (this._numTickets[ticket] == 0) return false;
    // FIXME: dstにticketで移動可能であることを確認する
    return true;
  }

  // dstにticketで移動する。移動ができない場合は例外を投げる。
  moveBy(ticket: Ticket, dst: number): void {
    if (!this.canMoveBy(ticket, dst))
      throw new Error(`${dst}に${ticket2str(ticket)}で移動できません`);
    this._numTickets[ticket]--;
    this._pos = dst;
  }

  // ダブルムーブカードを使用する。ダブルムーブカードがもう無い場合は例外を投げる。
  useDoubleMove() {
    if (this._numDoubleMove == 0) throw new Error('ダブルムーブカードがもうありません');
    this._numDoubleMove--;
  }

  // deep copyを行う。
  clone() {
    return Object.create(this);
  }
}

// ゲームがいまどの状態にあるかを表す
enum GameScene {
  MOVE_MRX,
  MOVE_PL1,
  MOVE_PL2,
  MOVE_PL3,
  MOVE_PL4,
  MOVE_PL5,
  MOVE_PL6,
  FIN_ARRESTED,
  FIN_ESCAPED,
}

export class Game {
  private _actors: Array<Actor>; // ボード上のピン。サイズは常に6（刑事5＋Mr.X）。
  private _currentScene: GameScene; // ゲームの現在の状態。

  constructor(initPos: Array<number> /* 初期位置。0番目がMr.X */) {
    this._actors = [];
    for (let i = 0; i < 6; i++) this._actors.push(new Actor(initPos[i], i === 0));

    this._currentScene = GameScene.MOVE_MRX;
  }

  get currentScene(): GameScene {
    return this._currentScene;
  }

  private get hasGameFinished(): boolean {
    return (
      this.currentScene == GameScene.FIN_ARRESTED || this.currentScene == GameScene.FIN_ESCAPED
    );
  }

  private get currentActor(): Actor {
    switch (this._currentScene) {
      case GameScene.MOVE_MRX:
        return this._actors[0];
      case GameScene.MOVE_PL1:
        return this._actors[1];
      case GameScene.MOVE_PL2:
        return this._actors[2];
      case GameScene.MOVE_PL3:
        return this._actors[3];
      case GameScene.MOVE_PL4:
        return this._actors[4];
      case GameScene.MOVE_PL5:
        return this._actors[5];
      case GameScene.MOVE_PL6:
        return this._actors[6];
      default:
        throw new Error('不正なthis._currentScene');
    }
  }

  private get hasMrXArrested(): boolean {
    // FIXME: 刑事とMr.Xが同じ場所にいるかを確認する
    return false;
  }

  // ticketを使ってdstに動く。動けない場合は例外を投げる。
  moveBy(ticket: Ticket, dst: number): void {
    if (this.hasGameFinished) throw new Error('終了したゲームではコマを動かせません');

    // FIXME: 移動先が他の刑事と被っていないか確認する
    this.currentActor.moveBy(ticket, dst);
    // FIXME: currentSceneを進める
    // FIXME: 逮捕エンドの場合ゲームを終了する
  }

  // 今ticketを使って動くことができる場所を全て返す
  listReachablePos(ticket: Ticket): Array<number> {
    // FIXME: 実装する
    return [];
  }
}

/*
// Knuth shuffle (or Durstenfeld shuffle)
// Thanks to: https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// 初期位置の候補を得る。ACTOR_INIT_POS_CANDをシャッフルし、その先頭6つを使用する。
const initPosCand = Array.from(ACTOR_INIT_POS_CAND);
shuffleArray(initPosCand);
*/
