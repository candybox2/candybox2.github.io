///<reference path="Resource.ts"/>

Saving.registerBool("candiesThrownGotChocolateBar", false);

class CandiesThrown extends Resource{
    // The game
    private game: Game;
    
    // Smileys
    private smileys: CandiesThrownSmiley[] = [new CandiesThrownSmileyFirstLine("."),
                                 new CandiesThrownSmileyFirstLine("..."),
                                 new CandiesThrownSmileyFirstLine("...?"),
                                 new CandiesThrownSmileyFirstLine("...? :|"),
                                 new CandiesThrownSmileyFirstLine("...? :/"),
                                 new CandiesThrownSmileyFirstLine("...? :("),
                                 new CandiesThrownSmileyFirstLine("...? :["),
                                 new CandiesThrownSmileyFirstLine("...? :{"),
                                 new CandiesThrownSmileyFirstLine("...? :'("),
                                 new CandiesThrownSmileyFirstLine("...? (;_;)"),
                                 new CandiesThrownSmileyFirstLine("...?  (;_;)"),
                                 new CandiesThrownSmileyFirstLine("...?   (;_;)"),
                                 new CandiesThrownSmileyFirstLine("...?    (;_;)"),
                                 new CandiesThrownSmileyFirstLine("...?   (;_;)"),
                                 new CandiesThrownSmileyFirstLine("...?  (;_;)"),
                                 new CandiesThrownSmileyFirstLine("...? (;_;)"),
                                 new CandiesThrownSmileyFirstLine("...? (;__;)"),
                                 new CandiesThrownSmileyFirstLine("...? (;___;)"),
                                 new CandiesThrownSmileyFirstLine("...? (;__;)"),
                                 new CandiesThrownSmileyFirstLine("...? (;_;)"),
                                 new CandiesThrownSmileyFirstLine("...? (;.;)"),
                                 new CandiesThrownSmileyFirstLine("...? (:.:)"),
                                 new CandiesThrownSmileyFirstLine("...? (:_:)"),
                                 new CandiesThrownSmileyFirstLine("...? (;_;)"),
                                 new CandiesThrownSmileyFirstLine("...?(;_;)"),
                                 new CandiesThrownSmileyFirstLine("...? (;_;)"),
                                 new CandiesThrownSmileyFirstLine("...?(;_;)"),
                                 new CandiesThrownSmileyFirstLine("...? (;_;)"),
                                 new CandiesThrownSmileyFirstLine("...?(;_;)"),
                                 new CandiesThrownSmileyFirstLine("...? (;_;)"),
                                 new CandiesThrownSmileyFirstLine("...? (;_;) come"),
                                 new CandiesThrownSmileyFirstLine("...? (;_;) come on"),
                                 new CandiesThrownSmileyFirstLine("...? (-_-) come on"),
                                 new CandiesThrownSmileyFirstLine("...? (-_-)"),
                                 new CandiesThrownSmileyFirstLine("...? (-_-) why are you throwing candies like that?"),
                                 new CandiesThrownSmileyFirstLine("...? (o_o)"),
                                 new CandiesThrownSmileyFirstLine("...? (o_o) I'm gonna destroy something if you don't stop!!"),
                                 new CandiesThrownSmileyFirstLine("...? (o_o)"),
                                 new CandiesThrownSmileyFirstLine("...?  (o_o)"),
                                 new CandiesThrownSmileyFirstLine("...?   (o_o)"),
                                 new CandiesThrownSmileyFirstLine("...?    (o_o)"),
                                 new CandiesThrownSmileyFirstLine("...?     (o_o)"),
                                 new CandiesThrownSmileyFirstLine("...?      (o_o)"),
                                 new CandiesThrownSmileyFirstLine("...?       (o_o)"),
                                 new CandiesThrownSmileyFirstLine("...?       (O_O)"),
                                 new CandiesThrownSmileyFirstLine("...?      (O_O)"),
                                 new CandiesThrownSmileyFirstLine("...?     (O_O)"),
                                 new CandiesThrownSmileyFirstLine("...?    (O_O)"),
                                 new CandiesThrownSmileyFirstLine("...?   (O_O)"),
                                 new CandiesThrownSmileyFirstLine("...?  (O_O)"),
                                 new CandiesThrownSmileyFirstLine("...? (O_O)"),
                                 new CandiesThrownSmileyFirstLine("...?(O_O)"),
                                 new CandiesThrownSmileyFirstLine("...(O_O)"),
                                 new CandiesThrownSmileyFirstLine("..(O_O)"),
                                 new CandiesThrownSmileyFirstLine(".(O_O)"),
                                 new CandiesThrownSmileyFirstLine("(O_O)"),
                                 new CandiesThrownSmileyFirstLine(" (O_O)"),
                                 new CandiesThrownSmileyFirstLine(" (o_o)"),
                                 new CandiesThrownSmileyFirstLine(" (o_o)"),
                                 new CandiesThrownSmileyFirstLine(" (o_o)"),
                                 new CandiesThrownSmileyFirstLine(" (o_o)"),
                                 new CandiesThrownSmileyFirstLine(" (o_o) stop!!"),
                                 new CandiesThrownSmileyFirstLine(" (o_o)"),
                                 new CandiesThrownSmileyFirstLine(" (o_o)"),
                                 new CandiesThrownSmileyFirstLine(" (;_;)"),
                                 new CandiesThrownSmileyFirstLine(" (;_;) well."),
                                 new CandiesThrownSmileyFirstLine(" (;_;) I guess I'll just leave, then."),
                                 new CandiesThrownSmileyFirstLine("  (;_;)"),
                                 new CandiesThrownSmileyFirstLine("   (;_;)"),
                                 new CandiesThrownSmileyFirstLine("    (;_;)"),
                                 new CandiesThrownSmileyFirstLine("     (;_;)"),
                                 new CandiesThrownSmileyFirstLine("      (;_;)"),
                                 new CandiesThrownSmileyFirstLine("       (;_;)"),
                                 new CandiesThrownSmileyFirstLine("        (;_;)"),
                                 new CandiesThrownSmileyFirstLine("         (;_;)"),
                                 new CandiesThrownSmileyFirstLine("          (;_;)"),
                                 new CandiesThrownSmileyFirstLine("           (;_;)"),
                                 new CandiesThrownSmileyFirstLine("            (;_;)"),
                                 new CandiesThrownSmileyFirstLine("             (;_;)"),
                                 new CandiesThrownSmileyFirstLine("              (;_;)"),
                                 new CandiesThrownSmileyFirstLine("               (;_;)"),
                                 new CandiesThrownSmileyFirstLine("                (;_;)"),
                                 new CandiesThrownSmileyFirstLine("                 (;_;)"),
                                 new CandiesThrownSmileyFirstLine("                  (;_;)"),
                                 new CandiesThrownSmileyFirstLine("                   (;_;)"),
                                 new CandiesThrownSmileyFirstLine("                    (;_;)"),
                                 new CandiesThrownSmileyFirstLine("                     (;_;)"),
                                 new CandiesThrownSmileyFirstLine("                      (;_;)"),
                                 new CandiesThrownSmileyFirstLine("                      (;_;)|"),
                                 new CandiesThrownSmileyFirstLine("                      (o_o)|"),
                                 new CandiesThrownSmileyFirstLine("                 crap (o_o)|"),
                                 new CandiesThrownSmileyFirstLine("               a wall (o_o)|"),
                                 new CandiesThrownSmileyFirstLine("                      (._.)|"),
                                 new CandiesThrownSmileyFirstLine("     I'm trapped here (._.)|"),
                                 new CandiesThrownSmileyFirstLine("    maybe...          (._.)|"),
                                 new CandiesThrownSmileyFirstLine("    maybe I could dig (._.)|"),
                                 new CandiesThrownSmileyFirstLine("    dig in the ground (._.)|"),
                                 new CandiesThrownSmileyFirstLine("                      (._.)|"),
                                 new CandiesThrownSmileyFirstLine("                *dig* (._.)|"),
                                 new CandiesThrownSmileyFirstLine("                    (._.)|"),
                                 new CandiesThrownSmileyFirstLine("              *dig* (._.)|"), // Here we made a gap because we switch from 990 to 1 000 candies thrown
                                 new CandiesThrownSmileyFirstLine("                    (._.)|"),
                                 new CandiesThrownSmileyFirstLine("              *dig* (._.)|"),
                                 new CandiesThrownSmileyFirstLine("                    (._.)|"),
                                 new CandiesThrownSmileyFirstLine("              *dig* (._.)|"),
                                 new CandiesThrownSmileyFirstLine("                    (._.)|"),
                                 new CandiesThrownSmileyFirstLine("              *dig* (._.)|"),
                                 new CandiesThrownSmileyCave("(O_O)", new Pos(57, 1)),
                                 new CandiesThrownSmileyCave("(O_O)", new Pos(57, 2)),
                                 new CandiesThrownSmileyCave("(O_O)", new Pos(57, 3)),
                                 new CandiesThrownSmileyCave("(O_O)", new Pos(57, 4)),
                                 new CandiesThrownSmileyCave("(O_O)", new Pos(57, 5)),
                                 new CandiesThrownSmileyCave("(O_O)", new Pos(57, 6)),
                                 new CandiesThrownSmileyCave("(O_O)", new Pos(57, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(57, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(57, 7)).addObject(new CandiesThrownSmileyCaveObject("wow.", new Pos(52, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(57, 7)).addObject(new CandiesThrownSmileyCaveObject("I didn't expect that.", new Pos(35, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(57, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(55, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(53, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(51, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(49, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(47, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(45, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(45, 7)).addObject(new CandiesThrownSmileyCaveObject("what's this place?", new Pos(39, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(45, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(43, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(41, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(39, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(37, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(35, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(33, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(33, 7)).addObject(new CandiesThrownSmileyCaveObject("it looks like a cave", new Pos(26, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(33, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(31, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(29, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(27, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(25, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(23, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(21, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(19, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(19, 7)).addObject(new CandiesThrownSmileyCaveObject("oh! there's a chest over there!", new Pos(8, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(19, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(17, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(15, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(13, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(11, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(9, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(7, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(5, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("I guess I should open it", new Pos(3, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)).openChest(),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("!!!", new Pos(5, 5))).openChest(),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("I found a chocolate bar!", new Pos(3, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("...", new Pos(3, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("hey, listen", new Pos(3, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("I'll give you the chocolate bar", new Pos(3, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("if you swear to stop throwing candies", new Pos(3, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("okay?", new Pos(3, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("throw 10 last candies to let me know if you agree", new Pos(3, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("good. here's the bar. no more throwing!!", new Pos(3, 5))),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)),
                                 new CandiesThrownSmileyCave("(._.)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("Hey?!", new Pos(3, 5))),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("You're still throwing candies!", new Pos(3, 5))),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("Candies are precious, you know.", new Pos(3, 5))),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("...", new Pos(5, 5))),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("I'm out of here.", new Pos(3, 5))),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("*dig*", new Pos(10, 7))),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 7)),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("*dig*", new Pos(10, 7))),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 7)),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("*dig*", new Pos(10, 7))),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 7)),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 7)).addObject(new CandiesThrownSmileyCaveObject("*dig*", new Pos(10, 7))),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 8), CandiesThrownSmileyCaveStep.SECOND_ROOM),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 9), CandiesThrownSmileyCaveStep.SECOND_ROOM),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 10), CandiesThrownSmileyCaveStep.SECOND_ROOM),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 11), CandiesThrownSmileyCaveStep.SECOND_ROOM),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 12), CandiesThrownSmileyCaveStep.SECOND_ROOM),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 13), CandiesThrownSmileyCaveStep.SECOND_ROOM),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 14), CandiesThrownSmileyCaveStep.SECOND_ROOM),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(4, 15), CandiesThrownSmileyCaveStep.SECOND_ROOM),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(6, 15), CandiesThrownSmileyCaveStep.SECOND_ROOM),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(8, 15), CandiesThrownSmileyCaveStep.SECOND_ROOM),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(10, 15), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(;_;)", new Pos(12, 15), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(o_o)", new Pos(12, 15), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(o_o)", new Pos(12, 14), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(o_o)", new Pos(12, 13), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(o_o)", new Pos(12, 12), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(o_o)", new Pos(13, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(o_o)", new Pos(15, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(o_o)", new Pos(17, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(o_o)", new Pos(18, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(O_O)", new Pos(18, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(O_O)", new Pos(18, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("this is...", new Pos(13, 9))),
                                 new CandiesThrownSmileyCave("(O_O)", new Pos(18, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("a room...", new Pos(13, 9))),
                                 new CandiesThrownSmileyCave("(O_O)", new Pos(18, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("FULL OF GIANT CANDIES!", new Pos(33, 9))),
                                 new CandiesThrownSmileyCave("(O_O)", new Pos(18, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(18, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(18, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("well", new Pos(16, 9))),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(18, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("don't worry about the candies you threw", new Pos(6, 7))),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(18, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("just let me eat those candies and you're forgiven", new Pos(6, 7))),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(18, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("<3", new Pos(17, 9))),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(20, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(22, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(22, 10), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(23, 9), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(25, 9), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(27, 9), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(29, 9), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(31, 9), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(33, 9), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(34, 10), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(34, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(36, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(38, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(40, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(42, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(43, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                ];
                                
    // *nom* *nom* smileys
    private nomNomSmileys: CandiesThrownSmiley[] = [new CandiesThrownSmileyCave("(^_^)", new Pos(43, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(43, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("*nom*", new Pos(40, 9))),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(43, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("*nom*", new Pos(41, 9))),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(43, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("*nom*", new Pos(42, 9))),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(43, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("*nom*", new Pos(43, 9))),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(43, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("*nom*", new Pos(44, 9))),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(43, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("*nom*", new Pos(45, 9))),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(43, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("*nom*", new Pos(46, 9))),
                                 new CandiesThrownSmileyCave("(^_^)", new Pos(43, 11), CandiesThrownSmileyCaveStep.THIRD_ROOM).addObject(new CandiesThrownSmileyCaveObject("*nom* *nom*", new Pos(40, 9))),
                                ];
                                 
    // Index of the *nom* *nom* smiley we show
    private nomNomSmileyIndex: number = 0;
    
    // Constructor
    constructor(game: Game, savingPrefix: string){
        super(savingPrefix);
        this.game = game;
    }
    
    // Public methods
    public add(n: number): boolean{ // We override the add method in order to give the player a chocolate bar when the little thing open the chest
        // We save the return value
        var returnValue: boolean = super.add(n);
        // If it's time to get this chocolate bar, we get it
        if(Saving.loadBool("candiesThrownGotChocolateBar") == false && Math.floor(this.getCurrent()/10) - 1 == 162){
            this.game.getChocolateBars().add(1);
            Saving.saveBool("candiesThrownGotChocolateBar", true);
        }
        // We choose a random *nom* *nom* smiley index in case we're at this step of the animation
        this.nomNomSmileyIndex = Random.between(0, this.nomNomSmileys.length-1);
        // We return the return value
        return returnValue;
    }
    
    public draw(renderArea: RenderArea, x: number, y: number): number{
        var n: number = this.getCurrent();
        var smileyIndex: number;
        var base: string;
        
        // Set the base
        if(n < 0)
            base = "You threw negative candies ?!";
        else if(n == 1)
            base = "You threw 1 candy on the ground";
        else{
            base = "You threw " + Algo.numberToStringButNicely(n) + " candies on the ground";
        }
        
        // Get the index of the smiley we should add
        smileyIndex = Math.floor(n/10) - 1;
        
        // Add a smiley from the smileys array if the index is correct
        if(smileyIndex >= 0 && smileyIndex < this.smileys.length){
            // Draw the smiley and return the correct y gap
            return this.smileys[smileyIndex].draw(renderArea, x, y, base);
        }
        // Else, if the index is too low, don't add any smiley
        else if(smileyIndex < 0){
            // We just draw the base and return 0
            renderArea.drawString(base, x, y);
            return 0;
        }
        // Else, add the *nom* *nom* smiley
        else{
            // Draw the smiley and return the correct y gap
            return this.nomNomSmileys[this.nomNomSmileyIndex].draw(renderArea, x, y, base);
        }
    }
}