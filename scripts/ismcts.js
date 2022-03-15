class ISMCTS {
    static getCpuAdvice(game, thinkingTimeInSeconds) {
        let startTime = Date.now();
        let rootNode = new TreeNode();

        while ((Date.now() - startTime) < thinkingTimeInSeconds * 1000) {
            //Determinization            
            let detGameState = game.determinize();

            let node;
            node = ISMCTS.selection(rootNode, detGameState);
            node = ISMCTS.expansion(node, detGameState);

            let value = ISMCTS.simulation(detGameState);
            ISMCTS.backpropagation(node, value);
        }

        let mostVisitedChild = rootNode.children.reduce((max, obj) => (max.visits > obj.visits) ? max : obj);
        return { card: mostVisitedChild.move.card, isSpecial: mostVisitedChild.move.isSpecial };
    }

    static selection(rootNode, gameState) {
        let node = rootNode;

        while (true) {
            let possibleMoves = gameState.getPossibleMoves();

            for (const move of possibleMoves) {
                if (!node.hasChildWithMove(move)) return node;
            }

            node = node.getUCB1Child(possibleMoves);
            gameState.applyMove({ card: node.move.card, isSpecial: node.move.isSpecial });

            if (gameState.resultFromCpuPerspective != null) return node;
        }

        return node;
    }

    static expansion(node, gameState) {
        if (gameState.resultFromCpuPerspective != null) return node;

        let possibleMoves = gameState.getPossibleMoves();
        for (const move of possibleMoves) node.addChildWithMove(move);

        node = node.getUCB1Child(possibleMoves);
        gameState.applyMove({ card: node.move.card, isSpecial: node.move.isSpecial });
        return node;
    }

    static simulation(gameState) {
        while (true) {
            if (gameState.resultFromCpuPerspective != null) return gameState.resultFromCpuPerspective;

            let possibleMoves = gameState.getPossibleMoves();
            let randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

            gameState.applyMove({ card: randomMove.card, isSpecial: randomMove.isSpecial });
        }
    }

    static backpropagation(node, value) {
        while (true) {
            node.visits++;
            if (node.parent == null) break;

            node.value += node.teamCpu ? -value : value;
            node = node.parent;
        }
    }
}


class TreeNode {
    constructor(move = null, parent = null) {
        this.move = move;
        this.parent = parent;
        this.children = [];

        this.value = 0;
        this.visits = 0;
        this.ucb1 = null;
    }

    hasChildWithMove(move) {
        function equal(m1, m2) {
            return (m1.playerID == m2.playerID && m1.card.equal(m2.card) && m1.isSpecial == m2.isSpecial);
        }

        for (const child of this.children) {
            if (equal(child.move, move)) return true;
        }

        return false;
    }

    addChildWithMove(move) {
        if (this.hasChildWithMove(move)) return;
        this.children.push(new TreeNode(move, this));
    }

    getUCB1Child(moves) {
        function getChildWithMove(move, children) {
            function equal(m1, m2) {
                return (m1.playerID == m2.playerID && m1.card.equal(m2.card) && m1.isSpecial == m2.isSpecial);
            }

            for (const child of children) {
                if (equal(child.move, move)) return child;
            }
        }

        let filteredChildren = [];
        for (const move of moves) filteredChildren.push(getChildWithMove(move, this.children));

        for (const child of this.children) child.calculateUCB1(this.visits);
        return filteredChildren.reduce((max, obj) => (max.ucb1 > obj.ucb1) ? max : obj);
    }

    calculateUCB1(parentVisits) {
        if (this.visits == 0) this.ucb1 = Infinity;
        else this.ucb1 = (this.value / this.visits) + 2 * Math.sqrt((Math.log(parentVisits) / this.visits));
    }
}