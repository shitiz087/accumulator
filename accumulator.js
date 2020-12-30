
const fs = require('fs');
const lines = fs.readFileSync('input.txt', { encoding: 'utf-8' });

class Accumulator {
    constructor(string, options = {}) {
        this.accumulatorValue = 0;
        this.instructionPointer = 0;
        this.instructionSet = new Set();
        this.options = options;
        this.isInstructionExecutionFinished = false;

        this.parsedInstructions = string.split('\n').filter(x => x).map((line) => {
            const { groups } = /^(?<instruction>\D+) \+?(?<value>-?\d+)$/.exec(line);
            groups.value = parseInt(groups.value);
            return groups;
        });
    }

    getAccumulatorValue() {
        while (true) {
            if (this.instructionPointer == this.parsedInstructions.length) {
                this.isInstructionExecutionFinished = true;
                break;
            }
            const { instruction, value } = this.parsedInstructions[this.instructionPointer];

            if (this.instructionSet.has(this.instructionPointer)) {
                if (this.options.warning) console.log('problem question answer = ', +this.accumulatorValue);
                break;
            }
            this.instructionSet.add(this.instructionPointer)

            switch (instruction) {
                case 'nop':
                    this.instructionPointer++;
                    break;
                case 'acc':
                    this.accumulatorValue += value;
                    this.instructionPointer++;
                    break;
                case 'jmp':
                    this.instructionPointer += value;
                    break;

                default:
                    throw new Error('not implemented');
                    break;
            }
        }
    }
}

const a = new Accumulator(lines, { warning: true });
a.getAccumulatorValue();
const code = a.parsedInstructions;
for (let i = 0; i < code.length; i++) {
    const element = code[i];
    if (element.instruction === 'nop' || element.instruction === 'jmp') {
        const copy = JSON.parse(JSON.stringify(code));
        copy[i].instruction = element.instruction === 'nop' ? 'jmp' : 'nop';
        const newSource = copy.map(x => `${x.instruction} ${x.value}`).join('\n');
        const fixedProgram = new Accumulator(newSource);
        fixedProgram.getAccumulatorValue();
        if (fixedProgram.isInstructionExecutionFinished) {
            console.log('bonus question answer = ' + fixedProgram.accumulatorValue);
        }
    }
}