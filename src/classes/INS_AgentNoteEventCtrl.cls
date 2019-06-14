public class INS_AgentNoteEventCtrl {
    @AuraEnabled
    public static Note submitNewNote(String note, String acctId){
        Note newNote = new Note(Title = 'New', Body = note, ParentId = acctId);
        insert newNote;
        updateAccountPersonLifeEvent(note, acctId);
        return newNote;
    }
    
   @AuraEnabled
   public static void updateAccountPersonLifeEvent(String note, string recordId) {
       
        note = note.toLowerCase();
        Account a = [ SELECT Id, PersonContactId, BillingState, ShippingState FROM Account WHERE Id = :recordId ];
        
        if (note.contains('baby')){
            
            date babyDueDate;
            babyDueDate = Date.today();
            babyDueDate = babyDueDate.addmonths(6);
            
            PersonLifeEvent event = new PersonLifeEvent(Name = system.Label.IDO_NewBaby, PrimaryPersonId = a.PersonContactId, EventType = 'Baby ', EventDate = babyDueDate, IsTentative = true);
            insert event;

            
        } else if(note.contains('reset')) {
            
            /*Remove Baby Life Event from the Account*/
            List<PersonLifeEvent> events = [SELECT Id FROM PersonLifeEvent 
                                              WHERE PrimaryPersonId = :a.PersonContactId
                                              AND EventType in ('Baby', 'Bereavement')];
            
            if (events != null){
                delete events;
            }
            
           /*Update Alerts to Active*/
            List<FinServ__Alert__c> alerts = [SELECT Id FROM FinServ__Alert__c 
                                              WHERE FinServ__Account__c = :a.Id
                                              AND FinServ__Active__c = FALSE];
           
            if (alerts.size() > 0){
                for(FinServ__Alert__c alert : alerts) {
                    alert.FinServ__Active__c = true;
                    update alert;
                }
            }

            
            /*Remove all Newly created Policies from the Account*/
            List<FinServ__Alert__c> deathAlerts = [SELECT Id FROM FinServ__Alert__c 
                                              WHERE FinServ__Message__c  = 'Recent Bereavement:'
                                              ];
 
          
            if (deathAlerts != null){
                delete deathAlerts;
            }  
            
        }
       
       
   }
}