VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
    
  config.vm.define "appserver" do |instance|
    instance.vm.box = "ubuntu/precise64"
    instance.vm.synced_folder "applications", "/home/vagrant/applications"
    instance.vm.network "private_network", ip: "192.168.62.10"
    instance.vm.provision :ansible do |ansible|
      ansible.playbook = "provisioning/appserver.yml"
    end
  end
  
  config.vm.define "keyserver" do |instance|
    instance.vm.box = "ubuntu/precise64"
    instance.vm.network "private_network", ip: "192.168.62.11"
    instance.vm.provision :ansible do |ansible|
      ansible.playbook = "provisioning/keyserver.yml"
    end
  end
  
end