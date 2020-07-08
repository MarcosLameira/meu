import {SpeechBubble} from "./SpeechBubble";
import {PlayerAnimationNames} from "../Player/Animation";
import BitmapText = Phaser.GameObjects.BitmapText;

interface AnimationData {
    key: string;
    frameRate: number;
    repeat: number;
    frameModel: string; //todo use an enum
    frameStart: number;
    frameEnd: number;
}

export abstract class Character extends Phaser.Physics.Arcade.Sprite {
    private bubble: SpeechBubble|null = null;
    private readonly playerName: BitmapText;
    public PlayerValue: string;
    public PlayerTexture: string;


    constructor(scene: Phaser.Scene,
                x: number,
                y: number,
                texture: string,
                name: string,
                direction: string,
                moving: boolean,
                frame?: string | number
    ) {
        super(scene, x, y, texture, frame);

        this.PlayerValue = name;
        this.PlayerTexture = texture;
        this.playerName = new BitmapText(scene, x, y - 25, 'main_font', name, 8);
        this.playerName.setOrigin(0.5).setCenterAlign().setDepth(99999);
        scene.add.existing(this.playerName);

        this.scene.sys.updateList.add(this);
        this.scene.sys.displayList.add(this);
        //this.setScale(2);
        this.scene.physics.world.enableBody(this);
        this.setImmovable(true);
        this.setCollideWorldBounds(true);
        this.setSize(16, 16); //edit the hitbox to better match the character model
        this.setOffset(8, 16);
        this.setDepth(-1);

        this.scene.events.on('postupdate', this.postupdate.bind(this));

        this.initAnimation();
        this.playAnimation(direction, moving);
    }

    private initAnimation(): void {
        this.getPlayerAnimations(this.PlayerTexture).forEach(d => {
            this.scene.anims.create({
                key: d.key,
                frames: this.scene.anims.generateFrameNumbers(d.frameModel, {start: d.frameStart, end: d.frameEnd}),
                frameRate: d.frameRate,
                repeat: d.repeat
            });
        })
    }

    private getPlayerAnimations(name: string): AnimationData[] {
        return [{
            key: `${name}-${PlayerAnimationNames.WalkDown}`,
            frameModel: name,
            frameStart: 0,
            frameEnd: 2,
            frameRate: 10,
            repeat: -1
        }, {
            key: `${name}-${PlayerAnimationNames.WalkLeft}`,
            frameModel: name,
            frameStart: 3,
            frameEnd: 5,
            frameRate: 10,
            repeat: -1
        }, {
            key: `${name}-${PlayerAnimationNames.WalkRight}`,
            frameModel: name,
            frameStart: 6,
            frameEnd: 8,
            frameRate: 10,
            repeat: -1
        }, {
            key: `${name}-${PlayerAnimationNames.WalkUp}`,
            frameModel: name,
            frameStart: 9,
            frameEnd: 11,
            frameRate: 10,
            repeat: -1
        }];
    }

    protected playAnimation(direction : string, moving: boolean): void {
        if (!this.anims) {
            console.error('ANIMS IS NOT DEFINED!!!');
            return;
        }
        if (moving && (!this.anims.currentAnim || this.anims.currentAnim.key !== direction)) {
            this.play(this.PlayerTexture+'-'+direction, true);
        } else if (!moving) {
            /*if (this.anims.currentAnim) {
                this.anims.stop();
            }*/
            this.play(this.PlayerTexture+'-'+direction, true);
            this.stop();
        }
    }

    move(x: number, y: number) {

        this.setVelocity(x, y);

        // up or down animations are prioritized over left and right
        if (this.body.velocity.y < 0) { //moving up
            this.play(`${this.PlayerTexture}-${PlayerAnimationNames.WalkUp}`, true);
        } else if (this.body.velocity.y > 0) { //moving down
            this.play(`${this.PlayerTexture}-${PlayerAnimationNames.WalkDown}`, true);
        } else if (this.body.velocity.x > 0) { //moving right
            this.play(`${this.PlayerTexture}-${PlayerAnimationNames.WalkRight}`, true);
        } else if (this.body.velocity.x < 0) { //moving left
            this.anims.playReverse(`${this.PlayerTexture}-${PlayerAnimationNames.WalkLeft}`, true);
        }

        if (this.bubble) {
            this.bubble.moveBubble(this.x, this.y);
        }

        //update depth user
        this.setDepth(this.y);
    }

    postupdate(time: number, delta: number) {
        //super.update(delta);
        this.playerName.setPosition(this.x, this.y - 25);
    }

    stop(){
        this.setVelocity(0, 0);
        this.anims.stop();
    }

    say(text: string) {
        if (this.bubble) return;
        this.bubble = new SpeechBubble(this.scene, this, text)
        //todo make the bubble destroy on player movement?
        setTimeout(() => {
            if (this.bubble !== null) {
                this.bubble.destroy();
                this.bubble = null;
            }
        }, 3000)
    }

    destroy(fromScene?: boolean): void {
        if (this.scene) {
            this.scene.events.removeListener('postupdate', this.postupdate.bind(this));
        }
        super.destroy(fromScene);
        this.playerName.destroy();
    }
}
