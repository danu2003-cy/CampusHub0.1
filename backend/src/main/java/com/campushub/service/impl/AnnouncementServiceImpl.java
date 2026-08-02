package com.campushub.service.impl;

import com.campushub.dto.AnnouncementDto;
import com.campushub.entity.Announcement;
import com.campushub.entity.Club;
import com.campushub.entity.User;
import com.campushub.repository.AnnouncementRepository;
import com.campushub.repository.ClubRepository;
import com.campushub.repository.UserRepository;
import com.campushub.service.AnnouncementService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<AnnouncementDto> getAllAnnouncements() {

        return announcementRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AnnouncementDto getAnnouncementById(Long id) {

        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        return convertToDto(announcement);
    }

    @Override
    public AnnouncementDto createAnnouncement(AnnouncementDto announcementDto) {

        Club club = clubRepository.findById(announcementDto.getClubId())
                .orElseThrow(() -> new RuntimeException("Club not found"));

        User user = userRepository.findById(announcementDto.getPostedById())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Announcement announcement = new Announcement();

        announcement.setClub(club);
        announcement.setTitle(announcementDto.getTitle());
        announcement.setContent(announcementDto.getContent());
        announcement.setPostedBy(user);
        announcement.setPostedAt(LocalDateTime.now());

        Announcement savedAnnouncement = announcementRepository.save(announcement);

        return convertToDto(savedAnnouncement);
    }

    @Override
    public AnnouncementDto updateAnnouncement(Long id, AnnouncementDto announcementDto) {

        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        Club club = clubRepository.findById(announcementDto.getClubId())
                .orElseThrow(() -> new RuntimeException("Club not found"));

        User user = userRepository.findById(announcementDto.getPostedById())
                .orElseThrow(() -> new RuntimeException("User not found"));

        announcement.setClub(club);
        announcement.setTitle(announcementDto.getTitle());
        announcement.setContent(announcementDto.getContent());
        announcement.setPostedBy(user);

        Announcement updatedAnnouncement = announcementRepository.save(announcement);

        return convertToDto(updatedAnnouncement);
    }

    @Override
    public void deleteAnnouncement(Long id) {

        if (!announcementRepository.existsById(id)) {
            throw new RuntimeException("Announcement not found");
        }

        announcementRepository.deleteById(id);
    }

    private AnnouncementDto convertToDto(Announcement announcement) {

        AnnouncementDto dto = new AnnouncementDto();

        dto.setId(announcement.getId());
        dto.setClubId(announcement.getClub().getId());
        dto.setTitle(announcement.getTitle());
        dto.setContent(announcement.getContent());

        if (announcement.getPostedBy() != null) {
            dto.setPostedById(announcement.getPostedBy().getId());
        }
        dto.setPostedAt(announcement.getPostedAt());
        
        return dto;
    }
}