
    (() => {
      const display = document.getElementById('display');
      const buttons = document.querySelectorAll('button');
      let currentExpression = '';
      let lastResult = null;

      function updateDisplay() {
        display.textContent = currentExpression || '0';
      }
      function appendToExpression(value) {
        if (lastResult !== null) {
          // start new expression after result if number or decimal entered
          if (/[0-9.]/.test(value)) {
            currentExpression = value === '.' ? '0.' : value;
            lastResult = null;
            updateDisplay();
            return;
          } else {
            currentExpression = String(lastResult);
            lastResult = null;
          }
        }
        // Prevent multiple decimals in a number
        if (value === '.') {
          const parts = currentExpression.split(/[\+\-\*\/]/);
          if (parts[parts.length - 1].includes('.')) {
            return; // ignore extra decimal
          }
        }
        currentExpression += value;
        updateDisplay();
      }
      function clearExpression() {
        currentExpression = '';
        lastResult = null;
        updateDisplay();
      }
      function deleteLast() {
        if (lastResult !== null) return; // ignore delete after result shown
        currentExpression = currentExpression.slice(0, -1);
        updateDisplay();
      }
      function calculate() {
        if (!currentExpression) return;
        // Replace multiplication and division Unicode symbols if present
        const sanitizedExpression = currentExpression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        try {
          // Only allow digits, operators, decimal, parentheses
          if (!/^[0-9+\-*/.\s()]+$/.test(sanitizedExpression)) {
            display.textContent = 'Error';
            currentExpression = '';
            return;
          }
          const evalResult = Function(`"use strict"; return (${sanitizedExpression})`)();
          if (evalResult === Infinity || evalResult === -Infinity || isNaN(evalResult)) {
            display.textContent = 'Error';
            currentExpression = '';
            return;
          }
          lastResult = evalResult;
          currentExpression = String(evalResult);
          updateDisplay();
        } catch {
          display.textContent = 'Error';
          currentExpression = '';
        }
      }

      buttons.forEach(button => button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        if (!action) return;
        if (action === 'clear') {
          clearExpression();
        } else if (action === 'delete') {
          deleteLast();
        } else if (action === 'equals') {
          calculate();
        } else if (action === 'add') {
          appendToExpression('+');
        } else if (action === 'subtract') {
          appendToExpression('-');
        } else if (action === 'multiply') {
          appendToExpression('×');
        } else if (action === 'divide') {
          appendToExpression('÷');
        } else if (action === 'decimal') {
          appendToExpression('.');
        } else {
          // numbers
          appendToExpression(action);
        }
      }));

      // Keyboard support
      window.addEventListener('keydown', e => {
        if (e.key >= '0' && e.key <= '9') {
          appendToExpression(e.key);
        } else if (e.key === '.') {
          appendToExpression('.');
        } else if (e.key === 'Backspace') {
          deleteLast();
        } else if (e.key === 'Escape') {
          clearExpression();
        } else if (e.key === 'Enter' || e.key === '=') {
          e.preventDefault();
          calculate();
        } else if (e.key === '+') {
          appendToExpression('+');
        } else if (e.key === '-') {
          appendToExpression('-');
        } else if (e.key === '*') {
          appendToExpression('×');
        } else if (e.key === '/') {
          appendToExpression('÷');
        }
      });

      updateDisplay();
    })();
