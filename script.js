document.addEventListener('DOMContentLoaded', function() {

    // ========== Select2 for Branch ==========
    $('.branch-select').select2({
        placeholder: "Select a branch",
        allowClear: true,
        width: '100%'
    });

    // ========== Branch management ==========
    $('#add-branch').click(function() {
        const newBranch = prompt("Enter new branch name:");
        if (newBranch && newBranch.trim() !== "") {
            if (!$('.branch-select option[value="' + newBranch + '"]').length) {
                $('.branch-select').append(new Option(newBranch, newBranch));
                $('.branch-select').val(newBranch).trigger('change');
            } else {
                alert("This branch already exists!");
            }
        }
    });

    $('#delete-branch').click(function() {
        const selectedBranch = $('.branch-select').val();
        if (selectedBranch) {
            if (confirm(`Delete branch: ${selectedBranch}?`)) {
                $('.branch-select option[value="' + selectedBranch + '"]').remove();
                $('.branch-select').val(null).trigger('change');
            }
        } else {
            alert("Please select a branch to delete");
        }
    });

    // ========== Form submission ==========
    $('#submit-btn').click(function(e) {
        e.preventDefault();

        const department = document.getElementById('department-select').value;
        if (!department) {
            alert('Please select a department.');
            document.getElementById('department-select').focus();
            return;
        }

        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const formData = new FormData(document.getElementById('ticket-form'));
        // 🔴 Replace this with your own deployed web app URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyM3C9UejUGKRVGuNPeKab0wFRBaTTquxWcL9_NYv9hx82w9Fjc6AdNLC8VA-ux8WH0/exec';

        fetch(scriptURL, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.result === 'success') {
                alert(`✅ Ticket ${data.ticketNumber} submitted successfully!`);
                document.getElementById('ticket-form').reset();
                $('.branch-select').val(null).trigger('change');
                $('#department-select').val('');
                // ✅ Fixed: now uses .form-scroll (the current design's scroll area)
                const scrollArea = document.querySelector('.form-scroll');
                if (scrollArea) scrollArea.scrollTop = 0;
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        })
        .catch(error => {
            console.error('Submission error:', error);
            alert('❌ Error submitting ticket: ' + error.message);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit 🚀';
        });
    });

});