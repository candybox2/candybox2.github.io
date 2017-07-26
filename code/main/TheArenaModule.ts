module TheArenaModule{
    var quests: { [s: string]: TheArenaModuleQuest; } = {};

    // Add a quest
    export function addQuest(quest: TheArenaModuleQuest): void{
        quests[quest.getQuestFolderName()] = quest;
    }

    // Get a quest
    export function getQuest(questFolderName: string): TheArenaModuleQuest{
        return quests[questFolderName];
    }
}