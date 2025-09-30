// 🎵 จัดการเสียงเอฟเฟกต์และเพลงทั้งหมดของเกม
const sounds = {
    // 🔊 เสียง UI เวลาเล่นเกม (กดปุ่ม, ชนะ, แพ้ ฯลฯ)
    click: new Audio('public/sounds/fx/click.ogg'),
    gameOver: new Audio('public/sounds/fx/game_over.ogg'),
    lose: new Audio('public/sounds/fx/lose.ogg'),
    win: new Audio('public/sounds/fx/win.ogg'),
    score: new Audio('public/sounds/fx/score.ogg'),
    score2: new Audio('public/sounds/fx/score2.ogg'),

    // เพลงพื้นหลังในฉากต่าง ๆ
    menuMusic: new Audio('public/sounds/music/pikachu_beach.ogg'),
    battleMusic: new Audio('public/sounds/music/classic_battle.ogg'),
    townMusic: new Audio('public/sounds/music/fallarbor_town.ogg'),
    jumpMusic: new Audio('public/sounds/music/pokemon_jump.ogg')
};

// 🔁 ตั้งค่าให้เพลงพื้นหลังเล่นวนซ้ำ
sounds.menuMusic.loop = true;
sounds.battleMusic.loop = true;
sounds.townMusic.loop = true;
sounds.jumpMusic.loop = true;

// 🔉 กำหนดระดับเสียง (เพลงจะเบากว่าเอฟเฟกต์)
Object.keys(sounds).forEach(key => {
    if (key.includes('Music')) {
        sounds[key].volume = 0.3; // เพลงพื้นหลัง
    } else {
        sounds[key].volume = 0.7; // เอฟเฟกต์เสียง
    }
});

// เก็บสถานะเพลงที่กำลังเล่น
let currentMusic = null;

// ฟังก์ชันเล่นเอฟเฟกต์เสียง
function playSound(soundName) {
    try {
        if (sounds[soundName]) {
            sounds[soundName].currentTime = 0;
            sounds[soundName].play();
        }
    } catch (e) {
        console.log('Sound play failed:', e);
    }
}

// ฟังก์ชันเล่นเพลงพื้นหลัง (หยุดเพลงเก่าก่อนเล่นเพลงใหม่)
function playMusic(musicName, fade = false) {
    try {
        // หยุดเพลงที่กำลังเล่น
        if (currentMusic && currentMusic !== sounds[musicName]) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
        }

        // เช็คเล่นเพลงใหม่
        if (sounds[musicName]) {
            currentMusic = sounds[musicName];
            currentMusic.play();
        }
    } catch (e) {
        console.log('Music play failed:', e);
    }
}

function stopMusic() {
    if (currentMusic) {
        currentMusic.pause();
        currentMusic.currentTime = 0;
        currentMusic = null;
    }
}

// ฟังก์ชันสุ่มเล่นเสียงต่อสู้ (เสียง score/score2)
function playRandomBattleSound() {
    const battleSounds = ['score', 'score2'];
    const randomSound = battleSounds[Math.floor(Math.random() * battleSounds.length)];
    playSound(randomSound);
}

// ควบคุมการเปิด/ปิดเสียงทั้งหมดในเกม
let soundEnabled = true;

function toggleSound() {
    soundEnabled = !soundEnabled;
    const toggleBtn = document.getElementById('soundToggle');

    if (soundEnabled) {
        toggleBtn.textContent = '🔊 เสียง: เปิด';
        toggleBtn.classList.remove('muted');
        // เล่นเพลงต่อหากกำลังเล่นอยู่
        if (currentMusic) {
            currentMusic.play();
        }
    } else {
        toggleBtn.textContent = '🔇 เสียง: ปิด';
        toggleBtn.classList.add('muted');
        // หยุดเสียงทั้งหมด
        stopMusic();
        Object.values(sounds).forEach(sound => {
            sound.pause();
        });
    }
}

// ปรับปรุงฟังก์ชันเล่นเสียง/เพลงให้ตรวจสอบก่อนว่าเสียงเปิดอยู่ไหม
const originalPlaySound = playSound;
const originalPlayMusic = playMusic;

playSound = function(soundName) {
    if (soundEnabled) {
        originalPlaySound(soundName);
    }
};

playMusic = function(musicName, fade = false) {
    if (soundEnabled) {
        originalPlayMusic(musicName, fade);
    }
};

// ข้อมูลพื้นฐานของโปเกมอน (HP, พลังโจมตี, ป้องกัน, ท่าโจมตี)
const pokemonData = {
    bulbasaur: {
        name: "Bulbasaur",
        maxHp: 45,
        hp: 45,
        attack: 49,
        defense: 49,
        sprite: "public/images/effects/bulba_jump.gif",
        attacks: [
            { name: "Tackle", power: 40, type: "normal" },
            { name: "Vine Whip", power: 45, type: "grass" },
            { name: "Razor Leaf", power: 55, type: "grass" },
            { name: "Growl", power: 0, type: "normal", effect: "lower-attack" }
        ]
    },
    charmander: {
        name: "Charmander",
        maxHp: 39,
        hp: 39,
        attack: 52,
        defense: 43,
        sprite: "public/images/effects/charmander.gif",
        attacks: [
            { name: "Scratch", power: 40, type: "normal" },
            { name: "Ember", power: 40, type: "fire" },
            { name: "Flamethrower", power: 90, type: "fire" },
            { name: "Growl", power: 0, type: "normal", effect: "lower-attack" }
        ]
    },
    squirtle: {
        name: "Squirtle",
        maxHp: 44,
        hp: 44,
        attack: 48,
        defense: 65,
        sprite: "public/images/effects/blastoise.gif",
        attacks: [
            { name: "Tackle", power: 40, type: "normal" },
            { name: "Water Gun", power: 40, type: "water" },
            { name: "Hydro Pump", power: 110, type: "water" },
            { name: "Tail Whip", power: 0, type: "normal", effect: "lower-defense" }
        ]
    },
    pikachu: {
        name: "Pikachu",
        maxHp: 35,
        hp: 35,
        attack: 55,
        defense: 40,
        sprite: "public/images/effects/pika_idle.gif",
        attacks: [
            { name: "Thunder Shock", power: 40, type: "electric" },
            { name: "Quick Attack", power: 40, type: "normal" },
            { name: "Thunderbolt", power: 90, type: "electric" },
            { name: "Tail Whip", power: 0, type: "normal", effect: "lower-defense" }
        ]
    }
};

// สถานะปัจจุบันของเกม (โปเกมอนผู้เล่น, ศัตรู, เทิร์น, จบเกมหรือยัง)
let gameState = {
    playerPokemon: JSON.parse(JSON.stringify(pokemonData.bulbasaur)),
    enemyPokemon: JSON.parse(JSON.stringify(pokemonData.pikachu)),
    currentTurn: "player",
    battleEnded: false
};

// ตารางความได้เปรียบ/เสียเปรียบของธาตุ (เช่น น้ำชนะไฟ, ไฟแพ้น้ำ)
const typeChart = {
    fire: { grass: 2, water: 0.5, fire: 0.5 },
    water: { fire: 2, grass: 0.5, water: 0.5 },
    grass: { water: 2, fire: 0.5, grass: 0.5 },
    electric: { water: 2, grass: 0.5, electric: 0.5 },
    normal: {}
};

// เริ่มต้นเกม (อัปเดตจอและข้อความเริ่มต้น)
function initGame() {
    updateDisplay();
    updateMessage("เลือกการกระทำของคุณ!");
}

// อัปเดต UI ของเกม (ชื่อ, HP, รูป, แถบพลังชีวิต)
function updateDisplay() {
    // อัปเดต Pokémon ของผู้เล่น
    document.getElementById('player-name').textContent = gameState.playerPokemon.name;
    document.getElementById('player-hp').textContent = `${gameState.playerPokemon.hp}/${gameState.playerPokemon.maxHp}`;
    document.getElementById('player-sprite').src = gameState.playerPokemon.sprite;

    // อัปเดต Pokémon ของศัตรู
    document.getElementById('enemy-name').textContent = gameState.enemyPokemon.name;
    document.getElementById('enemy-hp').textContent = `${gameState.enemyPokemon.hp}/${gameState.enemyPokemon.maxHp}`;
    document.getElementById('enemy-sprite').src = gameState.enemyPokemon.sprite;

    // อัปเดตแถบพลังชีวิต
    updateHealthBar('player');
    updateHealthBar('enemy');

    // อัปเดตเมนูท่าต่อสู้
    updateAttackMenu();
}

function updateHealthBar(target) {
    const pokemon = target === 'player' ? gameState.playerPokemon : gameState.enemyPokemon;
    const healthBar = document.getElementById(`${target}-health`);
    const healthPercentage = (pokemon.hp / pokemon.maxHp) * 100;

    healthBar.style.width = healthPercentage + '%';

    // เปลี่ยนสีตามระดับพลังชีวิต
    healthBar.classList.remove('low', 'critical');
    if (healthPercentage <= 20) {
        healthBar.classList.add('critical');
    } else if (healthPercentage <= 50) {
        healthBar.classList.add('low');
    }
}

function updateAttackMenu() {
    const attackMenu = document.getElementById('attack-menu');
    const attackButtons = attackMenu.querySelectorAll('.attack-btn:not(:last-child)');

    gameState.playerPokemon.attacks.slice(0, 3).forEach((attack, index) => {
        if (attackButtons[index]) {
            attackButtons[index].textContent = attack.name;
            attackButtons[index].onclick = () => useAttack(attack.name.toLowerCase().replace(/\s+/g, '-'));
        }
    });
}

function updateMessage(message) {
    document.getElementById('battle-message').textContent = message;
}

// แสดงเมนูโจมตี
function showAttackMenu() {
    if (gameState.battleEnded || gameState.currentTurn !== "player") return;

    playSound('click');
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('attack-menu').style.display = 'grid';
}

// กลับไปเมนูหลัก (จากเมนูโจมตี)
function goBack() {
    playSound('click');
    document.getElementById('attack-menu').style.display = 'none';
    document.getElementById('main-menu').style.display = 'grid';
}

// ใช้ท่าโจมตี (ฝั่งผู้เล่นกดเลือก)
function useAttack(attackName) {
    if (gameState.battleEnded || gameState.currentTurn !== "player") return;

    const attack = gameState.playerPokemon.attacks.find(a =>
        a.name.toLowerCase().replace(/\s+/g, '-') === attackName
    );

    if (!attack) return;

    playSound('click');
    // ผู้เล่นโจมตี
    executeAttack(gameState.playerPokemon, gameState.enemyPokemon, attack);

    // ตรวจสอบว่าศัตรูหมดสภาพหรือยัง
    if (gameState.enemyPokemon.hp <= 0) {
        endBattle("win");
        return;
    }

    // ตาของศัตรู
    gameState.currentTurn = "enemy";
    setTimeout(enemyTurn, 1500);

    goBack();
}

// คำนวณความเสียหายและเอฟเฟกต์ของการโจมตี
function executeAttack(attacker, defender, attack) {
    updateMessage(`${attacker.name} ใช้ ${attack.name}!`);

    // เล่นเสียงเอฟเฟกต์การโจมตี
    playRandomBattleSound();

    if (attack.power === 0) {
        // ท่าประเภทสถานะ (Status move)
        if (attack.effect === "lower-attack") {
            defender.attack = Math.max(1, Math.floor(defender.attack * 0.8));
            setTimeout(() => updateMessage(`${defender.name} โจมตีลดลง!`), 1000);
        } else if (attack.effect === "lower-defense") {
            defender.defense = Math.max(1, Math.floor(defender.defense * 0.8));
            setTimeout(() => updateMessage(`${defender.name} ป้องกันลดลง!`), 1000);
        }
        return;
    }

    // คำนวณความเสียหาย
    const effectiveness = getTypeEffectiveness(attack.type, getDefenderType(defender));
    const damage = Math.floor(
        ((2 * 50 + 10) / 250) * (attacker.attack / defender.defense) * attack.power * effectiveness + 2
    );

    // ใส่ความเสียหายให้กับผู้ถูกโจมตี
    defender.hp = Math.max(0, defender.hp - damage);

    // เพิ่มแอนิเมชันความเสียหาย
    const target = defender === gameState.playerPokemon ? 'player' : 'enemy';
    const sprite = document.querySelector(`#${target}-sprite`);
    sprite.classList.add('damage-animation');
    setTimeout(() => sprite.classList.remove('damage-animation'), 500);

    // อัปเดตการแสดงผล
    setTimeout(() => {
        updateDisplay();
        let effectivenessText = "";
        if (effectiveness > 1) effectivenessText = " มันมีประสิทธิภาพมาก!";
        else if (effectiveness < 1) effectivenessText = " มันไม่มีประสิทธิภาพ...";

        updateMessage(`สร้างความเสียหาย ${damage} แต้ม!${effectivenessText}`);
    }, 500);
}

function getDefenderType(pokemon) {
    if (pokemon.name === "Pikachu") return "electric";
    if (pokemon.name === "Charmander") return "fire";
    if (pokemon.name === "Bulbasaur") return "grass";
    if (pokemon.name === "Squirtle") return "water";
    return "normal";
}

function getTypeEffectiveness(attackType, defenderType) {
    if (!typeChart[attackType] || !typeChart[attackType][defenderType]) {
        return 1;
    }
    return typeChart[attackType][defenderType];
}

function enemyTurn() {
    if (gameState.battleEnded) return;

    // เลือกท่าโจมตีแบบสุ่ม
    const randomAttack = gameState.enemyPokemon.attacks[Math.floor(Math.random() * gameState.enemyPokemon.attacks.length)];

    executeAttack(gameState.enemyPokemon, gameState.playerPokemon, randomAttack);

    // ตรวจสอบว่าผู้เล่นหมดสภาพหรือยัง
    setTimeout(() => {
        if (gameState.playerPokemon.hp <= 0) {
            endBattle("lose");
            return;
        }

        // กลับมาเป็นตาของผู้เล่น
        gameState.currentTurn = "player";
        updateMessage("เลือกการกระทำของคุณ!");
    }, 2000);
}

function endBattle(result) {
    gameState.battleEnded = true;

    if (result === "win") {
        playSound('win');
        updateMessage(`คุณชนะแล้ว! ${gameState.enemyPokemon.name} หมดสภาพ!`);
    } else {
        playSound('lose');
        updateMessage(`คุณแพ้แล้ว! ${gameState.playerPokemon.name} หมดสภาพ!`);
    }

    // แสดงตัวเลือกเริ่มเกมใหม่
    setTimeout(() => {
        if (confirm("ต้องการเล่นใหม่หรือไม่?")) {
            restartGame();
        }
    }, 2000);
}

function restartGame() {
    goBackToMenu();
}

// ฟังก์ชันเมนูอื่น ๆ
function switchPokemon() {
    if (gameState.battleEnded) return;
    playSound('click');
    updateMessage("ไม่มี Pokemon อื่นที่จะเปลี่ยน!");
}

function useItem() {
    if (gameState.battleEnded) return;

    playSound('click');
    // ไอเท็มฟื้นฟูแบบง่าย
    const healAmount = Math.min(20, gameState.playerPokemon.maxHp - gameState.playerPokemon.hp);
    if (healAmount > 0) {
        gameState.playerPokemon.hp += healAmount;
        updateDisplay();

        // เพิ่มแอนิเมชันฟื้นฟู
        const sprite = document.querySelector('#player-sprite');
        sprite.classList.add('heal-animation');
        setTimeout(() => sprite.classList.remove('heal-animation'), 1000);

        updateMessage(`${gameState.playerPokemon.name} ฟื้นฟู ${healAmount} HP!`);

        // ตาของศัตรูหลังใช้ไอเท็ม
        gameState.currentTurn = "enemy";
        setTimeout(enemyTurn, 1500);
    } else {
        updateMessage(`${gameState.playerPokemon.name} มี HP เต็มอยู่แล้ว!`);
    }
}

function runAway() {
    if (gameState.battleEnded) return;

    playSound('click');
    if (Math.random() < 0.5) {
        updateMessage("หนีสำเร็จ!");
        setTimeout(() => {
            goBackToMenu();
        }, 1500);
    } else {
        updateMessage("หนีไม่สำเร็จ!");
        gameState.currentTurn = "enemy";
        setTimeout(enemyTurn, 1500);
    }
}

// เริ่มต้นระบบเสียงของเกมและเพลงเมนู
function initAudio() {
    // เล่นเพลงเมนูเมื่อโหลดหน้าเว็บ
    setTimeout(() => {
        playMusic('menuMusic');
    }, 500);
}

// เริ่มเกมเมื่อหน้าเว็บโหลดเสร็จ
window.addEventListener('load', () => {
    initAudio();
});

// ฟังก์ชันการนำทางหน้าจอ
function showPokemonSelect() {
    playMusic('townMusic');
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('pokemon-select-screen').style.display = 'block';
}

function showInstructions() {
    playMusic('jumpMusic');
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('instructions-screen').style.display = 'block';
}

function goBackToStart() {
    playMusic('menuMusic');
    document.getElementById('pokemon-select-screen').style.display = 'none';
    document.getElementById('instructions-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
}

function selectPokemon(pokemonKey) {
    // กำหนด Pokémon ที่ผู้เล่นเลือก
    gameState.playerPokemon = JSON.parse(JSON.stringify(pokemonData[pokemonKey]));

    // เลือก Pokémon ศัตรูแบบสุ่ม (ไม่ซ้ำกับผู้เล่น)
    const enemyOptions = Object.keys(pokemonData).filter(key => key !== pokemonKey);
    const randomEnemyKey = enemyOptions[Math.floor(Math.random() * enemyOptions.length)];
    gameState.enemyPokemon = JSON.parse(JSON.stringify(pokemonData[randomEnemyKey]));

    // เริ่มการต่อสู้
    startBattle();
}

function startBattle() {
    playMusic('battleMusic');
    document.getElementById('pokemon-select-screen').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';

    // รีเซ็ตสถานะเกม
    gameState.currentTurn = "player";
    gameState.battleEnded = false;

    // เริ่มต้นการต่อสู้
    initGame();
}

function goBackToMenu() {
    playMusic('menuMusic');
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';

    // รีเซ็ตกลับสู่สถานะเมนูหลัก
    goBack();
}