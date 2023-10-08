export const TRASHCAN_DIALOGUES: (string | string[])[] = [
    [
        "You've been staring at it for a while, but it's just an ordinary trash can",
        "As you continue staring at the trash cans, they seem to turn before your very eyes. The edges are no longer rusty and the dents are smoothed over.",
        "From under the lid comes a faint golden glow, sweet and alluring.",
        "For a moment, the trash cans turn into treasure chests.",
        "You take a deep breath and open the lid: it's empty...",
        "Wait! You reach deeper into the trash can. There's a piece of iron scrap on the bottom. Your hard work paid off! You finally found the treasure!",
        "You look back at your companions and see their complicated expressions",
    ],
    "A trash can, not remarkable in any way.",
    "You try to hold back the urge to open it.",
    "There doesn't seem much point in investigating a trash can.",
    "You immerse yourself in the joys of sorting garbage...",
    "To understand a city, go through its trash cans.",
    "A burning smell invades your nostrils as you approach the trash can.",
    "A pretty postcard is lying in the trash can. It reads: \"Friend, you've crossed the line. This isn't something you should have touched. Signed, Garbage King.\"",
    "Wait, why are you so interested in rooting through every trash can in the city? What do you have to gain?",
    "A Belobog trash can. Great place to hide something.",
    "A nice-looking trash can, but that's all it really is: a trash can.",
    "An overwhelmingly fishy smell emanates from the trash can as you remove the lid. Instead of fish, you find only a fish-related flyer. Is this how synesthesia works?"
]

export type AudioLine = {
    line: string,
    audio: string,
    icon: string,
    delay?: number
}

export const VOICE_LINE_DIALOGUES: AudioLine[] = [
    {
        line: "Mr Svarog, are trashcans very interesting?",
        audio: "clara_interesting",
        icon: "clara.webp"
    },
    {
        line: "Could you stop doing that the moment I look away?",
        audio: "dan_look",
        icon: "danheng.webp"
    },
    {
        line: "Come on, we don't have time to waste on digging through the trash.",
        audio: "dan_time",
        icon: "danheng.webp"
    },
    {
        line: "Are you kidding? You won't find me hiding in there.",
        delay: 1,
        audio: "kafka_hiding2",
        icon: "kafka.webp"
    },
    {
        line: "Uh, don't you have anything better to do?",
        audio: "march_better",
        icon: "march_angry.webp"
    },
    {
        line: "I guess even trashcans are serious business in London",
        audio: "march_business",
        icon: "march_photo.webp"
    },
    {
        line: "Come on, stop talking to the trashcans!",
        audio: "march_stop_talking",
        icon: "march_angry2.webp"
    },
    {
        line: "Why are you digging through the trashcan again!",
        audio: "march_why",
        icon: "march_angry.webp"
    },
    {
        line: "You don't look very excited at the outcome.",
        audio: "pompom_excited",
        icon: "pompom_warning.webp"
    },
    {
        line: "Pom-Pom thinks that if you enjoy this so much, there is plenty more trash on the Astral express",
        audio: "pompom_more",
        icon: "pompom.webp"
    },
    {
        line: "Are you searching in there for the secrets of the universe?",
        audio: "welt_secrets",
        icon: "welt.webp"
    }
]

export const ENDING_DIALOGUES: AudioLine[] = [
    {
        line: "I get it. That urge is too great for you to resist.",
        audio: "march_urge",
        icon: "march_photo.webp",
    },
    {
        line: "There is no turning back once you've walked down this path.",
        audio: "danheng_path",
        icon: "danheng.webp"
    }
]
