enum QuestEntityWeaponDelayType{
    FIXED, // The delay is always the same
    BETWEEN, // The delay is chosen randomly between two values
    ONCE_THEN_WAIT // We can attack immediately once, but then we have to wait for another attack
}