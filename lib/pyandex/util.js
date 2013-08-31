/**
 * User: pahaz
 * Date: 30.08.13
 * Time: 22:59
 */

define(['underscore'], function (_) {
    function generateRandomName() {
        var firstName = new Array("Runny", "Buttercup", "Dinky", "Stinky", "Crusty", "Greasy", "Gidget", "Cheesypoof", "Lumpy", "Wacky", "Tiny", "Flunky", "Fluffy", "Zippy", "Doofus", "Gobsmacked", "Slimy", "Grimy", "Salamander", "Oily", "Burrito", "Bumpy", "Loopy", "Snotty", "Irving", "Egbert");
        var lastName1 = new Array("Snicker", "Buffalo", "Gross", "Bubble", "Sheep", "Corset", "Toilet", "Lizard", "Waffle", "Kumquat", "Burger", "Chimp", "Liver", "Gorilla", "Rhino", "Emu", "Pizza", "Toad", "Gerbil", "Pickle", "Tofu", "Chicken", "Potato", "Hamster", "Lemur", "Vermin");
        var lastName2 = new Array("face", "dip", "nose", "brain", "head", "breath", "pants", "shorts", "lips", "mouth", "muffin", "butt", "bottom", "elbow", "honker", "toes", "buns", "spew", "kisser", "fanny", "squirt", "chunks", "brains", "wit", "juice", "shower");
        return firstName[_.random(firstName.length - 1)]; // + ' ' + lastName1[_.random(lastName1.length - 1)] + lastName2[_.random(lastName2.length - 1)];
    }

    return {
        'generateRandomName': generateRandomName
    }
});